const fs   = require('fs');
const path = require('path');

/**
 * Build a target directory and relative path for a file
 * based on a sequence of metadata keys or functions.
 *
 * @param {string} uploadDir  Absolute path to your base uploads folder
 * @param {object} metadata   { name, size, type, path, uploaded, ... }
 * @param {Array<string|function>} structure
 *        e.g. ['type','year','month','day'] or custom functions
 * @returns {{ targetDir: string, relativePath: string }}
 */
function organizeByMetadata(uploadDir, metadata, structure) {
  const segments = structure.map(key => {
    if (typeof key === 'function') {
      // user‐supplied function returns a string segment
      return key(metadata);
    }
    switch (key) {
      case 'type':
        // take 'image/png' → 'image'
        return metadata.type.split('/')[0];
      case 'year':
        return String(metadata.uploaded.getFullYear());
      case 'month':
        return String(metadata.uploaded.getMonth() + 1).padStart(2, '0');
      case 'day':
        return String(metadata.uploaded.getDate()).padStart(2, '0');
      case 'sizeRange':
        // example: bucket by size
        const kb = metadata.size / 1024;
        if (kb < 100)     return '<100KB';
        if (kb < 1024)    return '100KB-1MB';
                          return '>1MB';
      default:
        // fallback to metadata[key] if exists
        if (metadata[key] != null) return String(metadata[key]);
        throw new Error(`Unknown metadata key in organizer: ${key}`);
    }
  });

  // ensure deep folder exists
  const targetDir = path.join(uploadDir, ...segments);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // final relative path includes the filename
  const relativePath = segments.concat(metadata.name).join('/');
  return { targetDir, relativePath };
}

module.exports = { organizeByMetadata };
