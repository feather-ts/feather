import {deepValue} from './objects'

export function format(str: string, obj: any): string {
    return str.replace(/{{.*?}}/g, (m) => {
        return deepValue(obj, m.substring(2, m.length - 2))
    })
}

export function namedRegexMatch(text, regex, matchNames) {
    const matches = regex.exec(text)
    if (!matches) {
        return
    }
    return matches.reduce((result, match, index) => {
        if (index > 0) {
            result[matchNames[index - 1]] = match
        }
        return result
    }, {})
}

export const decapitalize = (str: string) => str.charAt(0).toLowerCase() + str.substr(1)

export const camelCaseFromHyphens = (str: string) =>
    str.replace(/\b-([a-z])/g, (all, char) => char.toUpperCase())
