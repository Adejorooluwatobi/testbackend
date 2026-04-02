class ContentDTO {
  constructor(model) {
    if (!model) return;
    this.id = model._id;
    // Spread the rest of the properties
    Object.assign(this, model.toObject ? model.toObject() : model);
    delete this._id;
    delete this.__v;
  }

  static format(model) {
    if (!model) return null;
    if (Array.isArray(model)) {
      return model.map(item => new ContentDTO(item));
    }
    return new ContentDTO(model);
  }
}

module.exports = ContentDTO;
