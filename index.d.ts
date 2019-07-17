export default class Plugin {
    constructor(options?: {
        /**
         * RegExp to filter urls
         */
        match?: RegExp | string;


        /**
         * Object to override default ext-folder map
         */
        dirs?: {[ext: string]: string[]};

        /**
         * Whether show log of replaced urls, default `true`
         */
        showLog?: boolean;
    });
}

