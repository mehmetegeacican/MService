const sinon = require('sinon');
const { signUp, login, viewUsers, updateUser } = require('../controllers/user.controller');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


describe('User Controller Tests', () => {
    afterEach(() => {
        sinon.restore(); // Restore mocks/stubs after each test
    });

    describe('signUp function', () => {
        test('should successfully create a new user and return a user with jwt token', async () => {
            // Given
            const req = {
                body: {
                    username: 'newuser',
                    email: 'newuser@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const findOneStub = sinon.stub(User, 'findOne').resolves(null);
            const hashStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword123');
            const mockUser = {
                _id: new ObjectId('676d28be7d836af854cb9a55'),
                username: 'newuser',
                email: 'newuser@example.com',
                role: 'sales',
                password: 'hashedPassword123'
            }
            const saveStub = sinon.stub(User.prototype, 'save').resolves(mockUser);
            // Stub jwt.sign to simulate JWT token generation
            const tokenMock = 'mockJWTtoken';
            const jwtSignStub = sinon.stub(jwt, 'sign').returns(tokenMock);

            // When
            await signUp(req, res);
            // Then
            // Ensure email is checked for duplicates
            sinon.assert.calledOnce(findOneStub);
            sinon.assert.calledWith(findOneStub, { email: 'newuser@example.com' }); 
            // Ensure password is hashed
            sinon.assert.calledOnce(hashStub);
            sinon.assert.calledWith(hashStub, 'password123', sinon.match.number);
            // Ensure the User save is called
            sinon.assert.calledOnce(saveStub);
            // Ensure the jwt sign is called
            sinon.assert.calledOnce(jwtSignStub);
            // Ensure status is 201
            sinon.assert.calledWith(res.status, 201);
            // Ensure the response is proper
            sinon.assert.calledWith(res.json, {
                message: 'User created successfully',
                user: sinon.match({
                    ...mockUser,
                    _id: sinon.match.instanceOf(ObjectId)
                }),
                token: tokenMock
            });

        });
        test('should return 400 in case of an existing user', async () => {
            // Given
            const req = {
                body: {
                    username: 'existingUser',
                    email: 'existinguser@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const mockExistingUser = { email: 'existinguser@example.com' };
            sinon.stub(User, 'findOne').resolves(mockExistingUser);
            // When
            await signUp(req, res);
            // Then
            sinon.assert.calledWith(res.status, 400);  // Ensure status is 400
            sinon.assert.calledWith(res.json, { message: 'User already exists' });
        });
        test('should handle server errors', async () => {
            // Given
            const req = {
                body: {
                    username: 'newUser',
                    email: 'newuser@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            // Stubs
            sinon.stub(User, 'findOne').rejects(new Error('Database error'));
            // When 
            await signUp(req, res);
            // Then
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Server error', error: 'Database error' });
        });
    });


    describe('login function', () => {
        test('should successfully validate authentication attempt and return user with jwt token', async () => {
            // Given
            const req = {
                body: {
                    email: 'user@example.com',
                    password: 'correctpassword'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            // Stub User.findOne to simulate the user exists with a hashed password
            const mockUser = {
                email: 'user@example.com',
                password: await bcrypt.hash('correctpassword', 10), // simulate hashed correct password
                _id: 'mockuser123',
                role: 'user'
            };
            sinon.stub(User, 'findOne').resolves(mockUser);

            // Stub jwt.sign to simulate JWT token generation
            const tokenMock = 'mockJWTtoken';
            sinon.stub(jwt, 'sign').returns(tokenMock);

            // When
            await login(req, res);

            // Then
            sinon.assert.calledWith(res.status, 200); // Ensure status is 200
            sinon.assert.calledWith(res.json, { message: 'Login successful', user: mockUser, token: tokenMock });
        });

        test('should return 404 in case of not finding the user', async () => {
            // Given
            const req = {
                body: {
                    email: 'nonexistinguser@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sinon.stub(User, 'findOne').resolves(null);
            // When
            await login(req, res);
            // Then
            sinon.assert.calledWith(res.status, 404);  // Ensure status is 404
            sinon.assert.calledWith(res.json, { message: 'User not found' });
        });

        test('should return 400 if password is incorrect', async () => {
            // Given
            const req = {
                body: {
                    email: 'user@example.com',
                    password: 'incorrectpassword'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            const mockUser = {
                email: 'user@example.com',
                password: await bcrypt.hash('correctpassword', 10)
            };
            sinon.stub(User, 'findOne').resolves(mockUser);

            // When
            await login(req, res);

            // Then
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.json, { message: 'Invalid credentials' });
        });

        test('should handle server errors', async () => {
            // Given
            const req = {
                body: {
                    email: 'user@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            // Stubs
            sinon.stub(User, 'findOne').rejects(new Error('Database error'));
            // When 
            await login(req, res);
            // Then
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Server error', error: 'Database error' });
        });

    });


    describe('viewUsers function', () => {
        test('should successfully return all users of the system', async () => {
            // Given
            const mockUsers = [
                {
                    "_id": "67694d02fc1566e3cbc219b1",
                    "username": "Jazz Jack Rabbit",
                    "email": "jazzjack@email.com",
                    "password": "$2a$10$89tHf8Li5tlrpknCWt5YzuEHhNxc6HmgB/S1eHQ4RNdkZ9Bsi4tUa",
                    "role": "admin",
                    "createdAt": "2024-12-23T11:44:02.223Z",
                    "updatedAt": "2024-12-23T12:05:21.289Z",
                    "__v": 0
                },
                {
                    "_id": "67694f016f8e728256359d36",
                    "username": "Jackie",
                    "email": "jazzjack2@email.com",
                    "password": "$2a$10$6fgYyfL.jZVczWCqZIhELuIL6CWx.qYUjErPcWVf.57HOT30Jhrau",
                    "role": "sales",
                    "createdAt": "2024-12-23T11:52:33.347Z",
                    "updatedAt": "2024-12-23T12:41:03.131Z",
                    "__v": 0
                }
            ];
            sinon.stub(User, 'find').resolves(mockUsers);
            // Request and Response
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            // When
            await viewUsers(req, res);
            // Then
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, mockUsers);
        });
        test('should successfully return empty array', async () => {
            // Given
            sinon.stub(User, 'find').resolves([]);
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            // When
            await viewUsers(req, res);
            // Then
            sinon.assert.calledWith(res.json, []);
        });
        test('should handle 500 server error', async () => {
            // Given
            sinon.stub(User, 'find').throws(new Error('Database connection error'));
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            // When
            await viewUsers(req, res);
            // Then
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Server error', error: 'Database connection error' });
        });
    });


    describe('updateUser function', () => {

        test('should successfully update an existing user with the new parameters', async () => {
            // Given
            const mockId = "676aa4d46d06419fded141cf"
            const mockUser = {
                "_id": mockId,
                "username": "Test",
                "email": "edited@email.com",
                "password": "newpasswordhashed",
                "role": "sales",
                "createdAt": "2024-12-24T12:11:00.907Z",
                "updatedAt": "2024-12-24T12:20:30.082Z",
                "__v": 0
            };
            const bcryptHashStub = sinon.stub(bcrypt, 'hash').resolves('newpasswordhashed');
            sinon.stub(User, 'findByIdAndUpdate').resolves(mockUser);
            const req = {
                params: { mockId },
                body: {
                    username: 'Test',
                    email: 'edited@email.com',
                    password: 'newpassword',
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            // When
            await updateUser(req, res);
            // Then
            sinon.assert.calledWith(bcryptHashStub, 'newpassword', 10);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, { message: 'User updated successfully', user: mockUser });
        });

        test('should handle 404 User not found', async () => {
            // Given
            const mockId = "12345";
            const req = {
                params: { mockId },
                body: {
                    username: 'newUsername',
                    email: 'newemail@example.com',
                    password: 'newpassword',
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sinon.stub(User, 'findByIdAndUpdate').resolves(null);
            // When
            await updateUser(req, res);
            // Then
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.json, { message: 'User not found' });
        });

        test('should handle 400 User ID is required', async () => {
            // Given
            // When
            // Then
        });

        test('should handle 500 server error', async () => {
            // Given
            const mockId = '12345';
            const req = {
                params: { mockId },
                body: {
                    username: 'newUsername',
                    email: 'newemail@example.com',
                    password: 'newpassword',
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sinon.stub(User, 'findByIdAndUpdate').throws(new Error('Database error'));
            // When
            await updateUser(req, res);
            // Then
            sinon.assert.calledWith(res.status, 500);  // Ensure status is 500
            sinon.assert.calledWith(res.json, { message: 'Server error', error: 'Database error' });
        });
    });




});