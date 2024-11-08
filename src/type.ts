/**
 * Represents a single item in a script, containing timing information and text.
 * @interface ScriptItem
 */
export interface ScriptItem {
    /** The start time of the script item in seconds. */
    start: number;
    /** The end time of the script item in seconds. */
    end: number;
    /** The main text of the script item. */
    text: string;
    /** Optional chorus text associated with the script item. */
    chorus?: string;
    /** An array of words within the script item, each with its own timing. */
    words?: LyricWord[];
    /** Optional translation text for the script item. */
    translation?: string;
    /** Optional singer name associated with the script item. */
    singer?: string;
}

/**
 * Represents a single word within a script item, with timing information.
 * @interface LyricWord
 */
export interface LyricWord {
    /** The start time of the word in seconds. */
    startTime: number;
    /** The end time of the word in seconds. */
    endTime: number;
    /** The actual word text. */
    word: string;
    /** Optional count of empty beats before the word. */
    emptyBeat?: number;
}

/**
 * Represents metadata associated with the lyrics, such as artist, title, etc.
 * @interface LyricMetadata
 */
export interface LyricMetadata {
    /** Artist name. */
    ar?: string;
    /** Title of the song. */
    ti?: string;
    /** Album name. */
    al?: string;
    /** Author of the lyrics. */
    au?: string;
    /** Length of the song (mm:ss). */
    length?: string;
    /** Specifies a global offset value for the lyric times, in milliseconds. 
     * The value is prefixed with either + or -, with + causing lyrics to appear sooner */
    offset?: string;
    /** Tool used for creating the LRC file. */
    tool?: string;
    /** The version of the program. */
    ve?: string;
}

/**
 * Represents the complete lyric data structure, combining metadata and script items.
 * @interface LyricData
 * @extends LyricMetadata
 */
export interface LyricData extends LyricMetadata {
    /** Array of script items contained in the lyric data. */
    scripts?: ScriptItem[];
    /** Additional properties can be added using a string index signature. */
    [key: string]: any;
}