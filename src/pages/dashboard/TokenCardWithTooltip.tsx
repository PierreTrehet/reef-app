import React, { useRef, useEffect } from 'react';
import { Components, Token } from '@reef-chain/react-lib';
import Uik from '@reef-chain/ui-kit';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import BigNumber from 'bignumber.js';
import { toCurrencyFormat } from '../../utils/utils';
import './token-card-tooltip.css';

const { TokenCard } = Components;

interface Props extends React.ComponentProps<typeof TokenCard> {
  token: Token;
}

const formatBalance = (token: Token): number => {
  try {
    return new BigNumber(token.balance.toString())
      .div(new BigNumber(10).pow(token.decimals))
      .toNumber();
  } catch {
    return 0;
  }
};

const formatCompact = (value: number): string => new Intl.NumberFormat(
  navigator.language,
  { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2 },
).format(value);

const TokenCardWithTooltip = ({ token, ...rest }: Props): JSX.Element => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const iconEl = iconRef.current;
    if (!wrapperEl || !iconEl) return;
    const valuesEl = wrapperEl.querySelector('.token-card__values');
    if (valuesEl) {
      valuesEl.insertAdjacentElement('afterend', iconEl);
    }
  }, []);

  const balance = formatBalance(token);
  const usdValue = balance * (rest as any).price || 0;
  const totalStr = `${formatCompact(balance)} (${toCurrencyFormat(usdValue, { maximumFractionDigits: 2 })})`;
  const tooltip = [
    `Total: ${totalStr}`,
    `Available: ${totalStr}`,
    `Staked (locked): ${formatCompact(0)} (${toCurrencyFormat(0)})`,
  ].join('\n');

  return (
    <div ref={wrapperRef} className="token-card-tooltip-wrapper">
      <TokenCard token={token} {...rest} />
      <div ref={iconRef} className="token-card-tooltip-icon">
        <Uik.Tooltip text={tooltip} position="bottom">
          <Uik.Icon icon={faCoins} />
        </Uik.Tooltip>
      </div>
    </div>
  );
};

export default TokenCardWithTooltip;
