import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'Сторінка: Що таке ТРІ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Що таке ТРІ',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Фонове зображення',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'body',
      title: 'Контент',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            decorators: [
              {title: 'Жирний', value: 'strong'},
              {title: 'Курсив', value: 'em'},
              {title: 'Підкреслений', value: 'underline'},
              {title: 'Перекреслений', value: 'strike-through'},
              {title: 'Код', value: 'code'},
              {title: 'Ліворуч', value: 'alignLeft'},
              {title: 'По центру', value: 'alignCenter'},
              {title: 'Праворуч', value: 'alignRight'},
              {title: 'Підсвітити', value: 'highlight'},
            ],
          },
        }),
        defineArrayMember({type: 'image'}),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
