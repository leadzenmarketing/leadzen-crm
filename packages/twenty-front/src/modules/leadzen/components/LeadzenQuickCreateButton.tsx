import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { useCreateNewRecord } from '@/object-record/hooks/useCreateNewRecord';
import { useObjectPermissionsForObject } from '@/object-record/hooks/useObjectPermissionsForObject';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { canCreateRecordsForObjectMetadataItem } from '@/object-record/utils/canCreateRecordsForObjectMetadataItem';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { isDefined } from 'twenty-shared/utils';
import { type IconComponent } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';

type LeadzenQuickCreateButtonProps = {
  objectNameSingular: string;
  label: string;
  Icon: IconComponent;
  isPrimary?: boolean;
  getRecordInput?: () => Partial<ObjectRecord>;
};

// Custom objects (e.g. salesActivity) exist only in workspaces set up for them.
export const LeadzenQuickCreateButton = ({
  objectNameSingular,
  ...props
}: LeadzenQuickCreateButtonProps) => {
  const objectMetadataItem = useAtomFamilySelectorValue(
    objectMetadataItemFamilySelector,
    { objectName: objectNameSingular, objectNameType: 'singular' },
  );

  if (!isDefined(objectMetadataItem)) {
    return null;
  }

  return (
    <LeadzenQuickCreateButtonForObject
      objectMetadataItem={objectMetadataItem}
      {...props}
    />
  );
};

type LeadzenQuickCreateButtonForObjectProps = Omit<
  LeadzenQuickCreateButtonProps,
  'objectNameSingular'
> & {
  objectMetadataItem: EnrichedObjectMetadataItem;
};

const LeadzenQuickCreateButtonForObject = ({
  objectMetadataItem,
  label,
  Icon,
  isPrimary = false,
  getRecordInput,
}: LeadzenQuickCreateButtonForObjectProps) => {
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
      onClick={() => createNewRecord(getRecordInput?.())}
    >
      {label}
    </Button>
  );
};
