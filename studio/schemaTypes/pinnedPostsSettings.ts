import {defineArrayMember, defineField, defineType} from 'sanity'

const pinnedPostReference = (title: string, pageValue: 'tips' | 'catalog' | 'about') =>
  defineField({
    name: `${pageValue}PinnedPosts`,
    title,
    type: 'array',
    description: 'Перетягуйте пости, щоб змінити порядок зверху сторінки',
    of: [
      defineArrayMember({
        type: 'reference',
        to: [{type: 'post'}],
        weak: true,
        options: {
          filter: 'pinToTop == true && postStyle == $pageValue',
          filterParams: {pageValue},
        },
      }),
    ],
  })

export default defineType({
  name: 'pinnedPostsSettings',
  title: 'Закріплені пости',
  type: 'document',
  fields: [
    pinnedPostReference('Поради: закріплені пости', 'tips'),
    pinnedPostReference('Каталог: закріплені пости', 'catalog'),
    pinnedPostReference('Що таке ТРІ: закріплені пости', 'about'),
  ],
})
