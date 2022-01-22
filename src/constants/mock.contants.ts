import { UserRoles } from '../auth/schemas/user.schema';

export const mockHotel = {
  name: 'Hotel 1',
  description: 'Hotel 1 description',
  email: 'hotel-fake@mail.com',
  address: '123 Fake St',
  category: 'FIVE_START',
  location: {},
  user: '61cd5ekcsv66945x1wc',
  _id: '61cd5ekcsv66945x1wc',
};
export const mockUser = {
  _id: '61cd5ekcsv66945x1wc',
  email: 'user1@mail.com',
  name: 'namefake',
  role: UserRoles.USER,
};
export const newHotel = {
  name: 'Hotel new',
  description: 'Hotel new description',
  email: 'fake@gmail.com',
  address: '123 Fake St',
  category: 'TWO_START',
  location: {},
  user: '61cd5ekcsv66945x1wc',
  _id: '61cd5ekcsv66945x1wc',
};

export const mockToken = 'jwtToken';

export const mockLoginDto = {
  email: 'user1@mail.com',
  password: '12345678',
};
