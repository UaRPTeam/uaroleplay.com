import {useDocumentOperation, type DocumentActionComponent} from 'sanity'

export const hidePostAction: DocumentActionComponent = (props) => {
  const {unpublish} = useDocumentOperation(props.id, props.type)

  if (!props.published) {
    return null
  }

  return {
    label: 'Сховати (в драфт)',
    title: 'Зняти з публікації та лишити документ як draft',
    tone: 'caution',
    onHandle: () => {
      unpublish.execute()
      props.onComplete()
    },
  }
}
