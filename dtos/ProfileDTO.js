class ProfileDTO {
  constructor(profile) {
    this.id = profile._id;
    this.userId = profile.user; // Can be ObjectId or populated User object
    this.phoneNumber = profile.phoneNumber || '';
    this.address = profile.address || '';
    this.dob = profile.dob || null;
    this.bio = profile.bio || '';
    this.city = profile.city || '';
    this.state = profile.state || '';
    this.country = profile.country || '';
    this.createdAt = profile.createdAt;
    this.updatedAt = profile.updatedAt;
  }

  static format(profile) {
    if (!profile) return null;
    if (Array.isArray(profile)) {
      return profile.map(item => new ProfileDTO(item));
    }
    return new ProfileDTO(profile);
  }
}

module.exports = ProfileDTO;
