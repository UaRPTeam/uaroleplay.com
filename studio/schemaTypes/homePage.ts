import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Сторінка: Головна',
  type: 'document',
  fields: [
    defineField({
      name: 'body',
      title: 'Контент під hero',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Heading 4', value: 'h4'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Ліворуч', value: 'alignLeft'},
              {title: 'По центру', value: 'alignCenter'},
              {title: 'Праворуч', value: 'alignRight'},
            ],
          },
        }),
        defineArrayMember({type: 'tilesSection'}),
      ],
    }),
  ],
})
