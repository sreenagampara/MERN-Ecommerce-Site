
import { Label, Box, DropZone, DropZoneItem } from '@adminjs/design-system'

const FileUpload = (props) => {
  const { property, onChange, record } = props

  const handleDrop = (files) => {
    onChange(property.name, files[0])
  }

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <DropZone 
        onChange={handleDrop} 
        multiple={false}
      />
      {record.params[property.name] && (
        <DropZoneItem fileName={record.params[property.name].name} />
      )}
    </Box>
  )
}

export default FileUpload