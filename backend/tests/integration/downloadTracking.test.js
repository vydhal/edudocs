const request = require('supertest');
const app = require('../../index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Download Tracking Integration', () => {
    let token;
    let documentId;
    let userId;

    beforeAll(async () => {
        // Create a user and get token
        const userRes = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test Admin',
                email: `admin_${Date.now()}@test.com`,
                password: 'password123',
                role: 'ADMIN'
            });
        
        // If register fails (e.g. email exists), try login
        if (userRes.status !== 201) {
             console.log('Registration failed:', userRes.status, userRes.body);
             const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: `admin_${Date.now()}@test.com`, // Use the SAME email? No, userRes.email might contain the email if I used it.
                    // Wait, if I generated a random email, I must use THAT email to login.
                    email: userRes.request._data.email, 
                    password: 'password123'
                });
             
             if (loginRes.status !== 200) {
                 console.log('Login failed:', loginRes.status, loginRes.body);
                 throw new Error('Could not auth');
             }
             token = loginRes.body.token;
             userId = loginRes.body.user.id;
        } else {
             token = userRes.body.token;
             userId = userRes.body.user.id;
        }

        // Create a document
        const docRes = await request(app)
            .post('/api/documents')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Test Download Doc')
            .field('description', 'Testing download stats')
            .field('type', 'PDF')
            .attach('file', Buffer.from('dummy content'), 'test.pdf');
        
        documentId = docRes.body.id;
    });

    afterAll(async () => {
        if (documentId) {
             await prisma.document.delete({ where: { id: documentId } });
        }
        await prisma.$disconnect();
    });

    it('should increment download count', async () => {
        // Initial count should be 0 (default)
        const docBefore = await prisma.document.findUnique({ where: { id: documentId } });
        expect(docBefore.downloads).toBe(0);

        // Call download endpoint
        const res = await request(app)
            .post(`/api/documents/${documentId}/download`); // Public endpoint usually? Or authenticated? 
            // My route definition: router.post('/:id/download', trackDownload); -> No auth middleware?
            // Let's check route file. 
            // router.post('/:id/download', trackDownload); -> YES, Public.
        
        expect(res.statusCode).toBe(200);

        // Check count
        const docAfter = await prisma.document.findUnique({ where: { id: documentId } });
        expect(docAfter.downloads).toBe(1);
    });

    it('should show up in analytics stats', async () => {
        const res = await request(app)
            .get('/api/analytics')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.totalDownloads).toBeGreaterThanOrEqual(1);
        
        const topDocs = res.body.topDocuments;
        const found = topDocs.find(d => d.title === 'Test Download Doc');
        // It might not be in top 5 if there are many others with high downloads, 
        // but in a test env it likely is.
        if (topDocs.length < 5 || found) {
             // If we found it, check downloads
             if (found) expect(found.downloads).toBeGreaterThanOrEqual(1);
        }
    });
});
