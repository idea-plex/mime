import { MimeMap } from "./interfaces";

export class Mime {
  // maps extension to mime type
  private types = new Map<string, string>();
  // maps mime type to extension
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
  define(typeMap: MimeMap, force?: boolean): void {
    for (const [typ, exts] of Object.entries(typeMap)) {
      const extensions = exts.map(t => t.toLowerCase());
      const type = typ.toLowerCase();

      for (const ext of extensions) {
        // If extension is prefixed with '*', it is used elsewhere and is not preferred for this type
        // So we skip it
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
    const last = strPath.replace(/^.*[/\\]/, '').toLowerCase();
    const ext = last.replace(/^.*\./, '').toLowerCase();

    const hasPath = last.length < strPath.length;
    const hasDot = ext.length < last.length - 1;

    return (hasDot || !hasPath) && this.types.get(ext) || null;
  }

  /**
   * Return file extension associated with a mime type
   */
  getExtension(type: string): string | null {    
    const result = /^\s*([^;\s]*)/.exec(type);

    if (result != null && result.length === 2 && result[0] != '') {      
      return this.extensions.get(result[1].toLowerCase()) ?? null;
    }

    return null;
  }

  getExtensions(): string[] {
    return [...this.types.keys()];
  }
}
