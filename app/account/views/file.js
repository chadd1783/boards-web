var Card = require('account/views/card');

module.exports = Card.extend({
  attributes: function() {
    return {
      'title': this.model.get('name'),
      'data-type': 'file'
    };
  },

  className: function() {
    var className = Card.prototype.className.apply(this, arguments);
    if (this.model.get('is_uploading')) className += ' is-uploading';
    return className;
  },

  template: require('account/templates/file'),

  elements: {
    previewLoader: 'img.card-preview-loader',
    uploadProgress: 'div.card-upload-progress'
  },

  bindings: function() {
    return _.merge({
      model: {
        'change:is_uploading': 'onUploadingStateChange',
        'change:upload_progress': 'onUploadProgress'
      }
    }, Card.prototype.bindings);
  },

  context: function() {
    var preview = this.model.get('featured')
      ? this.model.getMediumPreview()
      : this.model.getSmallPreview();

    return _.extend({}, this.model.attributes, {
      preview: preview,
      extension: this.model.getExtension(),
      hasNoPreview: this.model.hasNoPreview()
    });
  },

  initialize: function() {
    _.bindAll(this, ['onPreviewLoaded']);
  },

  updateUploadProgress: function(progress) {
    this.getElement('uploadProgress').text(progress + '%');
  },

  onRender: function() {
    this.getElement('previewLoader').load(this.onPreviewLoaded);
  },

  onUploadingStateChange: function(file, isUploading) {
    this.$el.toggleClass('is-uploading', isUploading);
  },

  onUploadProgress: function(file, progress) {
    if (this.isRendered) this.updateUploadProgress(progress);
  },

  onPreviewLoaded: function(event) {
    _.delay(_.bind(function() {
      this.$el.addClass('has-loaded-preview');
    }, this), 1);
  }
});
