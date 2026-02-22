import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {hidePostAction} from './actions/hidePostAction'
import './studio.css'

export default defineConfig({
  name: 'default',
  title: 'UaRP',

  projectId: 'ta87y5fo',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Контент')
          .items([
            S.listItem()
              .title('Що таке ТРІ')
              .id('aboutPage')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Закріплені пости')
              .id('pinnedPostsSettings')
              .child(S.document().schemaType('pinnedPostsSettings').documentId('pinnedPostsSettings')),
            ...S.documentTypeListItems().filter(
              (item) => !['aboutPage', 'pinnedPostsSettings'].includes(item.getId() ?? ''),
            ),
          ]),
    }),
    visionTool(),
  ],

  document: {
    actions: (prev, context) => {
      if (context.schemaType !== 'post') {
        return prev
      }

      return prev.map((action) => (action.action === 'unpublish' ? hidePostAction : action))
    },
  },

  schema: {
    types: schemaTypes,
  },
})
