import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Питання',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Відповідь',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [{title: 'Bulleted list', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Зображення (опційно)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imagePosition',
      title: 'Позиція зображення',
      type: 'string',
      options: {
        list: [
          {title: 'Над питанням', value: 'top'},
          {title: 'Під відповіддю', value: 'bottom'},
          {title: 'Ліворуч від питання', value: 'left'},
          {title: 'Праворуч від питання', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'top',
      hidden: ({parent}) => !parent?.image,
    }),
  ],
  preview: {
    select: {
      title: 'question',
      media: 'image',
    },
    prepare(selection) {
      return {
        title: selection.title || 'FAQ item',
        media: selection.media,
      }
    },
  },
})
