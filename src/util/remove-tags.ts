export function removeTags(text: string) {
  const recursiveRemoveEmptyTags = (text: string): string => {
    const emptyTagRegex = /<(\w+)(\s+[^>]*)?>\s*<\/\1>/g
    if (emptyTagRegex.test(text)) {
      return recursiveRemoveEmptyTags(text.replace(emptyTagRegex, ''))
    }
    return text
  }
  // Remove all <script> tags
  text = text.replaceAll(/\<script[\s\S]*?<\/script>/g, '')

  // Remove all <nav> tags
  text = text.replaceAll(/\<nav[\s\S]*?<\/nav>/g, '')

  // Remove all <styles tags
  text = text.replaceAll(/\<style[\s\S]*?<\/style>/g, '')

  // Remove any empty tags
  text = recursiveRemoveEmptyTags(text)

  return text
}
