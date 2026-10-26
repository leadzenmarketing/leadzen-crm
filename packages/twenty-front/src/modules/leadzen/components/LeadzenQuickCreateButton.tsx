import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useCreateNewRecord } from '@/object-record/hooks/useCreateNewRecord';
import { useObjectPermissionsForObject } from '@/object-record/hooks/useObjectPermissionsForObject';
import { canCreateRecordsForObjectMetadataItem } from '@/object-record/utils/canCreateRecordsForObjectMetadataItem';
import { type IconComponent } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';

type LeadzenQuickCreateButtonProps = {
  objectNameSingular: string;
  label: string;
  Icon: IconComponent;
  isPrimary?: boolean;
};

export const LeadzenQuickCreateButton = ({
  objectNameSingular,
  label,
  Icon,
  isPrimary = false,
}: LeadzenQuickCreateButtonProps) => {
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const objectPermissions = useObjectPermissionsForObject(
    objectMetadataItem.id,
  );
  const { createNewRecord } = useCreateNewRecord({ objectMetadataItem });

  if (
    !canCreateRecordsForObjectMetadataItem({
      objectPermissions,
      objectMetadataItem,
    })
  ) {
    return null;
  }

  return (
    <Button
      startIcon={<Icon />}
      color="accent"
      variant={isPrimary ? 'solid' : 'soft'}
      size="md"
      fullWidth
      onClick={() => createNewRecord()}
    >
      {label}
    </Button>
  );
};
