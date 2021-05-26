interface MimeMap {
    [mime: string]: string[];
}

declare class Mime {
    private types;
    private extensions;
    /**
   * @param typeMap [Object] Map of MIME type -> Array[extensions]
   * @param ...
   */
    constructor(...typeMaps: MimeMap[]);
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
    define(typeMap: MimeMap, force?: boolean): void;
    /**
     * Lookup a mime type based on extension
     */
    getType(path: unknown): string | null;
    /**
     * Return file extension associated with a mime type
     */
    getExtension(type: string): string | null;
    getExtensions(): string[];
}

declare const mime: Mime;
declare const mimeLite: Mime;

export { mime, mimeLite };
