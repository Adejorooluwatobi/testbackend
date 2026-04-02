class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static format(user) {
    if (Array.isArray(user)) {
      return user.map(item => new UserDTO(item));
    }
    return new UserDTO(user);
  }
}

module.exports = UserDTO;
