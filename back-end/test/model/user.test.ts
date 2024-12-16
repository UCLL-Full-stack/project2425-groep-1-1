import { set } from 'date-fns';
import { Role } from '../../types';
import { User } from '../../model/user';

const username: string = 'speedy-gonzales';
const email: string = 'speedy.gonzales@email.com';
const password: string = 'password123';
const role: Role = 'User';
const signUpDate: Date = new Date('1953-08-29T00:00:00.000Z');

const user = new User({
    username: 'speedy-gonzales',
    email: 'speedy.gonzales@email.com',
    password: 'password123',
    role: 'User',
    signUpDate: new Date('1953-08-29T00:00:00.000Z'),
});

test(`given: valid values for user, when: user is created, then: user is created with those values`, () => {
    // given

    // when
    const user = new User({
        username,
        email,
        password,
        role,
        signUpDate,
    });
    // then
    expect(user.getUsername()).toEqual(username);
    expect(user.getEmail()).toEqual(email);
    expect(user.getPassword()).toEqual(password);
    expect(user.getRole()).toEqual(role);
    expect(user.getSignUpDate()).toEqual(signUpDate);
});

test(`given: invalid username, when: user is created, then: an error is thrown`, () => {
    // given
    const invalidUsername = ' ';
    // when
    const createUser = () => {
        new User({
            username: invalidUsername,
            email,
            password,
            role,
            signUpDate,
        });
    };
    // then
    expect(createUser).toThrow('Username is required.');
});

test(`given: empty email, when: user is created, then: an error is thrown`, () => {
    // given
    const emptyEmail = ' ';
    // when
    const createUser = () => {
        new User({
            username,
            email: emptyEmail,
            password,
            role,
            signUpDate,
        });
    };
    // then
    expect(createUser).toThrow('Email is required.');
});

test(`given: invalid email, when: user is created, then: an error is thrown`, () => {
    // given
    const invalidEmail = 'in.valid@email@address.com';
    // when
    const createUser = () => {
        new User({
            username,
            email: invalidEmail,
            password,
            role,
            signUpDate,
        });
    };
    // then
    expect(createUser).toThrow('Email must be valid.');
});

test(`given: invalid password, when: user is created, then: an error is thrown`, () => {
    // given
    const invalidPassword = ' ';
    // when
    const createUser = () => {
        new User({
            username,
            email,
            password: invalidPassword,
            role,
            signUpDate,
        });
    };
    // then
    expect(createUser).toThrow('Password is required.');
});

test(`given: role is null, when: user is created, then: an error is thrown`, () => {
    // given
    const invalidRole: Role = null as any;
    // when
    const createUser = () => {
        new User({
            username,
            email,
            password,
            role: invalidRole,
            signUpDate,
        });
    };
    // then
    expect(createUser).toThrow('Role is required.');
});

test(`given: invalid role, when: user is created, then: an error is thrown`, () => {
    // given
    const invalidRole: Role = '  ' as any;
    // when
    const createUser = () => {
        new User({
            username,
            email,
            password,
            role: invalidRole,
            signUpDate,
        });
    };
    // then
    expect(createUser).toThrow('Role is required.');
});
