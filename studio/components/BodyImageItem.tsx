import {TrashIcon} from '@sanity/icons'
import {Button} from '@sanity/ui'
import {type ObjectItemProps} from 'sanity'

export default function BodyImageItem(props: ObjectItemProps) {
  return (
    <div className="body-image-item">
      {props.renderDefault({
        ...props,
        onOpen: () => {},
      })}
      <Button
        type="button"
        mode="ghost"
        tone="critical"
        text="Remove"
        icon={TrashIcon}
        className="body-image-remove-button"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          props.onRemove()
        }}
      />
    </div>
  )
}
