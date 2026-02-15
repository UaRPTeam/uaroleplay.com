import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'postStyle',
      title: 'Post style',
      type: 'string',
      options: {
        list: [
          {title: 'Поради', value: 'tips'},
          {title: 'Каталог', value: 'catalog'},
        ],
        layout: 'radio',
      },
      initialValue: 'tips',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hashtags',
      title: 'Hashtags',
      type: 'array',
      description: 'Оберіть категорію і додайте теги для неї',
      of: [
        defineArrayMember({
          name: 'hashtagGroup',
          title: 'Група хештегів',
          type: 'object',
          fields: [
            defineField({
              name: 'category',
              title: 'Категорія',
              type: 'string',
              options: {
                list: [
                  {title: "Вид анкети", value: 'profileType'},
                  {title: "Обов'язкові", value: 'required'},
                  {title: 'Гештеги фандому', value: 'fandomHashtags'},
                  {title: 'Жанр', value: 'genre'},
                  {title: 'Рейтинг', value: 'rating'},
                  {title: 'Кількість рядків', value: 'lineCount'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'tags',
              title: 'Хештеги',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'string',
                  validation: (Rule) =>
                    Rule.required().custom((value) => {
                      if (typeof value !== 'string') return 'Тег має бути текстом'
                      if (!value.trim()) return 'Тег не може бути порожнім'
                      if (!value.startsWith('#')) return 'Тег має починатися з #'
                      return true
                    }),
                }),
              ],
              options: {
                layout: 'tags',
              },
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              category: 'category',
              tags: 'tags',
            },
            prepare(selection) {
              const categoryMap: Record<string, string> = {
                profileType: 'Вид анкети',
                required: "Обов'язкові",
                fandomHashtags: 'Гештеги фандому',
                genre: 'Жанр',
                rating: 'Рейтинг',
                lineCount: 'Кількість рядків',
              }
              const categoryLabel = categoryMap[selection.category] ?? 'Категорія не вибрана'
              const tags = Array.isArray(selection.tags) ? selection.tags : []
              return {
                title: categoryLabel,
                subtitle: tags.length ? tags.join(' ') : 'Без тегів',
              }
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!Array.isArray(value)) return true
          const categories = value
            .map((item) => (item && typeof item === 'object' ? (item as {category?: string}).category : undefined))
            .filter((category): category is string => Boolean(category))

          if (new Set(categories).size !== categories.length) {
            return 'Кожна категорія може бути додана лише один раз'
          }
          return true
        }),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}, {type: 'image'}],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      postStyle: 'postStyle',
    },
    prepare(selection) {
      const {author, postStyle} = selection
      const styleLabel = postStyle === 'catalog' ? 'Каталог' : postStyle === 'tips' ? 'Поради' : undefined
      const authorPart = author ? `by ${author}` : ''
      const stylePart = styleLabel ? `[${styleLabel}]` : ''
      const subtitle = [stylePart, authorPart].filter(Boolean).join(' ')
      return {...selection, subtitle}
    },
  },
})
