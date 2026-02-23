import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tile',
  title: 'Tile',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Заголовок',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaLabel',
      type: 'string',
      title: 'Текст кнопки',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      type: 'string',
      title: 'Посилання (href)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Зображення',
      options: {hotspot: true},
    }),
    defineField({
      name: 'accent',
      type: 'string',
      title: 'Колір кнопки',
      options: {
        list: [
          {title: 'Blue', value: 'blue'},
          {title: 'Yellow', value: 'yellow'},
          {title: 'Pink', value: 'pink'},
          {title: 'Mint', value: 'mint'},
        ],
        layout: 'radio',
      },
      initialValue: 'blue',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'ctaLabel',
      media: 'image',
    },
  },
})
