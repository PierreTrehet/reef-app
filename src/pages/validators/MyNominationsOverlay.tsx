import React from 'react';
import Uik from '@reef-chain/ui-kit';
import { Components } from '@reef-chain/react-lib';
import { localizedStrings as strings } from '../../l10n/l10n';
import { shortAddress } from '../../utils/utils';

const { OverlayAction } = Components;

export interface ValidatorInfo {
  address: string;
  identity?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nominations: string[];
  validators: ValidatorInfo[];
}

const MyNominationsOverlay = ({ isOpen, onClose, nominations, validators }: Props): JSX.Element => {
  const rows = nominations.map((addr) => {
    const val = validators.find((v) => v.address === addr);
    return {
      address: addr,
      identity: val?.identity,
    } as ValidatorInfo;
  });

  return (
    <OverlayAction
      title={strings.my_nominations}
      className="nominations-overlay"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Uik.Table seamless>
        <Uik.TBody>
          {rows.map((r) => (
            <Uik.Tr key={r.address}>
              <Uik.Td>
                <div className="validators-page__id">
                  {r.identity ? r.identity : shortAddress(r.address)}
                </div>
              </Uik.Td>
            </Uik.Tr>
          ))}
        </Uik.TBody>
      </Uik.Table>
    </OverlayAction>
  );
};

export default MyNominationsOverlay;
