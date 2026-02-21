import {defineArrayMember, defineField, defineType} from 'sanity'
import BodyImageInput from '../components/BodyImageInput'
import BodyImageItem from '../components/BodyImageItem'

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
      title: 'Сторінка публікації',
      type: 'string',
      description: 'Оберіть сторінку, на якій має відображатися пост',
      options: {
        list: [
          {title: 'Поради', value: 'tips'},
          {title: 'Каталог', value: 'catalog'},
          {title: 'Що таке ТРІ', value: 'about'},
        ],
        layout: 'radio',
      },
      initialValue: 'tips',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pinToTop',
      title: 'Pin a post on the top',
      type: 'boolean',
      description: 'Увімкніть, щоб пост можна було закріпити зверху сторінки',
      initialValue: false,
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
      description:
        'Додайте текст і зображення. Для image: наведіть курсор, ↔ змінює ширину, ✥ перетягує позицію в body.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Звичайний', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'H5', value: 'h5'},
            {title: 'H6', value: 'h6'},
            {title: 'Цитата', value: 'blockquote'},
          ],
          lists: [
            {title: 'Маркірований список', value: 'bullet'},
            {title: 'Нумерований список', value: 'number'},
          ],
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
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Посилання',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
                  }),
                  defineField({
                    name: 'blank',
                    title: 'Відкрити в новій вкладці',
                    type: 'boolean',
                    initialValue: true,
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          components: {
            input: BodyImageInput,
            item: BodyImageItem,
          },
          options: {
            hotspot: false,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt текст',
              type: 'string',
              description: 'Короткий опис зображення (для доступності)',
            }),
            defineField({
              name: 'align',
              title: 'Вирівнювання зображення',
              type: 'string',
              options: {
                list: [
                  {title: 'Ліворуч', value: 'left'},
                  {title: 'По центру', value: 'center'},
                  {title: 'Праворуч', value: 'right'},
                ],
                layout: 'radio',
              },
              initialValue: 'center',
              hidden: true,
            }),
            defineField({
              name: 'widthPercent',
              title: 'Ширина зображення (%)',
              type: 'number',
              initialValue: 100,
              hidden: true,
              validation: (Rule) => Rule.required().min(20).max(100),
            }),
            defineField({
              name: 'offsetX',
              title: 'Зміщення X',
              type: 'number',
              initialValue: 0,
              hidden: true,
              validation: (Rule) => Rule.min(-400).max(400),
            }),
            defineField({
              name: 'offsetY',
              title: 'Зміщення Y',
              type: 'number',
              initialValue: 0,
              hidden: true,
              validation: (Rule) => Rule.min(0).max(300),
            }),
          ],
        }),
      ],
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
      const styleLabel =
        postStyle === 'catalog'
          ? 'Каталог'
          : postStyle === 'tips'
            ? 'Поради'
            : postStyle === 'about'
              ? 'Що таке ТРІ'
              : undefined
      const authorPart = author ? `by ${author}` : ''
      const stylePart = styleLabel ? `[${styleLabel}]` : ''
      const subtitle = [stylePart, authorPart].filter(Boolean).join(' ')
      return {...selection, subtitle}
    },
  },
})
