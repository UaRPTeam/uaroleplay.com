import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'tilesSection',
  title: 'CTA-картки',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Картки',
      type: 'array',
      of: [defineArrayMember({type: 'tile'})],
      validation: (Rule) => Rule.required().min(1).max(8),
    }),
    defineField({
      name: 'columnsDesktop',
      title: 'Колонки (desktop)',
      type: 'number',
      initialValue: 2,
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'rounded',
      title: 'Rounded corners',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      items: 'items',
      columnsDesktop: 'columnsDesktop',
    },
    prepare(selection) {
      const count = Array.isArray(selection.items) ? selection.items.length : 0
      return {
        title: 'CTA-картки',
        subtitle: `${count} tile(s) • ${selection.columnsDesktop ?? 2} col`,
      }
    },
  },
})
