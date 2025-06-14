import React from 'react';
import Uik from '@reef-chain/ui-kit';
import BN from 'bn.js';
import { Components } from '@reef-chain/react-lib';
import { localizedStrings as strings } from '../../l10n/l10n';
import { formatReefAmount } from '../../utils/formatReefAmount';
import { shortAddress } from '../../utils/utils';

const { OverlayAction } = Components;

export interface ValidatorInfo {
  address: string;
  identity?: string;
  totalBonded?: string;
  commission?: string;
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
      totalBonded: val?.totalBonded,
      commission: val?.commission,
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
        <Uik.THead>
          <Uik.Tr>
            <Uik.Th>{strings.account}</Uik.Th>
            <Uik.Th>{strings.total_staked}</Uik.Th>
            <Uik.Th>Commission</Uik.Th>
          </Uik.Tr>
        </Uik.THead>
        <Uik.TBody>
          {rows.map((r) => (
            <Uik.Tr key={r.address}>
              <Uik.Td>
                <div className="validators-page__id">
                  {r.identity ? r.identity : shortAddress(r.address)}
                </div>
              </Uik.Td>
              <Uik.Td>{r.totalBonded ? formatReefAmount(new BN(r.totalBonded)) : '-'}</Uik.Td>
              <Uik.Td>{r.commission ? `${(Number(r.commission) / 10000000).toFixed(2)}%` : '-'}</Uik.Td>
            </Uik.Tr>
          ))}
        </Uik.TBody>
      </Uik.Table>
    </OverlayAction>
  );
};

export default MyNominationsOverlay;
