import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tipsPage',
  title: 'Сторінка: Поради',
  type: 'document',
  fields: [
    defineField({
      name: 'faq',
      title: 'FAQ компонент',
      type: 'faqSection',
    }),
  ],
})
