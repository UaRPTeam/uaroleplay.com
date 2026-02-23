import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок секції',
      type: 'string',
      initialValue: 'FAQ',
    }),
    defineField({
      name: 'items',
      title: 'Питання та відповіді',
      type: 'array',
      of: [defineArrayMember({type: 'faqItem'})],
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare(selection) {
      const count = Array.isArray(selection.items) ? selection.items.length : 0
      return {
        title: selection.title || 'FAQ',
        subtitle: `${count} item(s)`,
      }
    },
  },
})
