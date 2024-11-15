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
    /** Optional index for the script item, used for sorting. */
    idx?: number;
}

/**
 * Represents a single word within a script item, with timing information.
 * @interface LyricWord
 */
export interface LyricWord {
    /** The start time (relative to the whole song) of the word in seconds.
     * Example: 12.7 means the singer first sang the word at 12.7 seconds into the song.
     */
    startTime: number;
    /** The end time (relative to the whole song) of the word in seconds.
     * Example: 13.2 means the singer finishes singing the word at 13.2 seconds into the song.
     */
    endTime: number;
    /** The actual word text. */
    word: string;
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
    /** Length of the song in the format `hh:mm:ss.sss`, 
     * in which hours and milliseconds may not be provided.*/
    length?: string;
    /** Specifies a global offset value for the lyric times, in milliseconds. 
     * The value is prefixed with either + or -, with + causing lyrics to appear sooner */
    offset?: string;
    /** Tool used for creating the LRC file. */
    tool?: string;
    /** The version of the program. */
    ve?: string;
    /** The ID of the song in Apple Music */
    appleMusicID?: string;
    /** The ID of the song in QQ Music */
    qqMusicID?: string;
    /** The ID of the song in Netease Music */
    neteaseMusicID?: string;
    /** The ID of the song in Spotify */
    spotifyID?: string;
    /** The BVID of the video of the song in Bilibili */
    bilibiliBVID?: string;
    /** The person who aligns the original lyrics text to the timeline 
     * (i.e., the producer of the final lyrics file - e.g., LRC, TTML) */
    aligner?: string;
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