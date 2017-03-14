// Asset.js - model class Asset

define([], function() {

  function matchProtocol(url) {
    if (window.location.protocol == "https:") {
      url = url.replace(/^http:/, "https:");
    }
    return url;
  }

  function toCloudinaryThumb(url) {
    return url
      .replace(/webm$/, "jpg")
      .replace(/v[0-9]+/, "w_400,h_400,c_crop,g_face,r_max/w_100");
  }

  // Constructed by wrapping a JSON object.
  return function(data) {

    Object.defineProperty(this, "id", {
      get: function () {
        return data.id;
      }
    });

    Object.defineProperty(this, "url", {
      get: function () {
        return data.url && matchProtocol(data.url);
      }
    });

    Object.defineProperty(this, "thumbnailUrl", {
      get: function () {
        return data.url && matchProtocol(toCloudinaryThumb(data.url));
      }
    });
  }
});