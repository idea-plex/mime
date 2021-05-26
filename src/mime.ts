import { MimeMap } from "./interfaces";

export class Mime {
    private types = new Map<string, string>();
    private extensions = new Map<string, string>();

  /**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
  constructor(...typeMaps: MimeMap[]) {    
    for (const arg of typeMaps) {
      this.define(arg);
    }
  }

  /**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
  define(typeMap: MimeMap, force?: boolean) {
      for (let [type, extensions] of Object.entries(typeMap)) {
        extensions = extensions.map(t => t.toLowerCase());
        type = type.toLowerCase();

        for (const ext of extensions) {
            // '*' prefix = not the preferred type for this extension.  So fixup the
            // extension, and skip it.
            if (ext.startsWith('*')) {
                continue;
            }

            if (!force && (this.types.has(ext))) {
                throw new Error(
                  'Attempt to change mapping for "' + ext +
                  '" extension from "' + this.types.get(ext) + '" to "' + type +
                  '". Pass `force=true` to allow this, otherwise remove "' + ext +
                  '" from the list of extensions for "' + type + '".'
                );
            }

            this.types.set(ext, type);
        }


      // Use first extension as default
      if (force || !this.extensions.has(type)) {
        const ext = extensions[0];
        this.extensions.set(type, (ext[0] !== '*') ? ext : ext.substr(1));
      }
    }
  }

  /**
   * Lookup a mime type based on extension
   */
  getType(path: unknown): string | null {
    const strPath = String(path);
    let last = strPath.replace(/^.*[/\\]/, '').toLowerCase();
    let ext = last.replace(/^.*\./, '').toLowerCase();

    let hasPath = last.length < strPath.length;
    let hasDot = ext.length < last.length - 1;

    return (hasDot || !hasPath) && this.types.get(ext) || null;
  }

  /**
   * Return file extension associated with a mime type
   */
  getExtension(type: string): string | null {
    const isType = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
    return type && this.extensions.get(type.toLowerCase()) || null;
  }

  getExtensions(): string[] {
      return [...this.types.keys()];
  }
}
