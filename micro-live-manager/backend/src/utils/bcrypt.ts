import * as _bcrypt from 'bcrypt';

const saltRounds = 10;

export const bcrypt = (value): string => {
    return _bcrypt.hashSync(value, saltRounds);
};

export const compareHash = (value, hash): boolean => {
    return _bcrypt.compareSync(value, hash);
};
