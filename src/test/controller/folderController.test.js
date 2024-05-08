describe('POST /user/folder/create/new', () => {
    it('should create a new folder and return 201 status', async () => {
      // Assume authMiddleware is mocked to always authenticate
      const folderData = { folderName: "New Folder" };
  
      const response = await request(app)
        .post('/user/folder/create/new')
        .send(folderData);
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('folderName', folderData.folderName);
    });
  
    it('should return 400 when folderName is not provided', async () => {
      const response = await request(app)
        .post('/user/folder/create/new')
        .send({});
  
      expect(response.statusCode).toBe(400);
    });
  });
  