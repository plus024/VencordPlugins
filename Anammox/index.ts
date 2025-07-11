import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    dms: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Remove shops above DMs list",
        restartNeeded: true,
    },
    serverBoost: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Remove server boost info above channel list",
        restartNeeded: true,
    },
    billing: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Remove billing settings",
        restartNeeded: true,
    },
    gift: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Remove gift button",
        restartNeeded: true,
    },
    gif: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Remove gif and sticker buttons",
        restartNeeded: true,
    },
    emojiList: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Remove unavailable categories from the emoji picker",
        restartNeeded: true,
    },
});

export default definePlugin({
    name: "Anammox",
    description: "A microbial process that plays an important part in the nitrogen cycle",
    authors: [Devs.Kyuuhachi],
    settings,

    patches: [
        { // Above DMs, mouse nav
            find: 'tutorialId:"direct-messages"',
            replacement: [
                {
                    match: /"premium"\)/,
                    replace: "$&&&undefined",
                },
                {
                    match: /"discord-shop"\)/,
                    replace: "$&&&undefined",
                },
            ],
            predicate: () => settings.store.dms,
        },
        { // Above DMs, keyboard nav
            find: ".hasLibraryApplication()&&!",
            replacement: [
                {
                    match: /\i\.\i\.APPLICATION_STORE,/,
                    replace: "/*$&*/",
                },
                {
                    match: /\i\.\i\.COLLECTIBLES_SHOP,/,
                    replace: "/*$&*/",
                },
            ],
            predicate: () => settings.store.dms,
        },
        { // Channel list server boost progress bar
            find: "useGuildActionRow",
            replacement: {
                match: /\i\.premiumProgressBarEnabled&&[^,]+/,
                replace: "null"
            },
            predicate: () => settings.store.serverBoost,
        },
        { // Settings, sidebar
            find: "#{intl::BILLING_SETTINGS}",
            replacement: [
                {
                    match: /(?<=#{intl::BILLING_SETTINGS}[^,]*?,)(?=div)/,
                    replace: "capitalism:true,"
                },
                {
                    match: /\i\?\i:\i\.toSpliced\(3,0,\i\)/,
                    replace: "($&).filter(e=>!e.capitalism)",
                },
            ],
            predicate: () => settings.store.billing,
        },
        { // Gift button
            find: '"sticker")',
            replacement: { match: /&&\i\.push\(\([^&]*?,"gift"\)\)/, replace: "", },
            predicate: () => settings.store.gift,
        },
        { // Gif and sticker buttons
            find: '"sticker")',
            replacement: [
                 { match: /&&\i\.push\([^&]*?,"gif"\)\)/, replace: "", },
                 { match: /&&\i\.push\([^&]*?,"sticker"\)\)/, replace: "", },
            ],
            predicate: () => settings.store.gif,
        },
        { // Emoji list
            find: "#{intl::EMOJI_PICKER_CREATE_EMOJI_TITLE}),size:",
            replacement: {
                match: /(\i)=\i\|\|!\i&&\i.\i.isEmojiCategoryNitroLocked\(\{[^}]*\}\);/,
                replace: "$&$1||"
            },
            predicate: () => settings.store.emojiList,
        },
        { // Emoji category list
            find: "#{intl::EMOJI_CATEGORY_TOP_GUILD_EMOJI},{guildName:",
            replacement: {
                match: /(?<=(\i)\.unshift\((\i)\):)(?=\1\.push\(\2\))/,
                replace: "$2.isNitroLocked||"
            },
            predicate: () => settings.store.emojiList,
        }
    ],
});
