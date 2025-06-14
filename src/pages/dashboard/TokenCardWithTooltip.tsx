import React, { useRef, useEffect } from 'react';
import { Components, Token, utils } from '@reef-chain/react-lib';
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

const formatCompact = (value: number): string => {
  if (value < 1) {
    return new Intl.NumberFormat(
      navigator.language,
      { maximumFractionDigits: 2 },
    ).format(value);
  }
  return new Intl.NumberFormat(
    navigator.language,
    { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2 },
  ).format(value);
};

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
  const price = (rest as any).price || 0;

  const locked = token.address === utils.REEF_ADDRESS
    ? new BigNumber((rest as any).selectedSigner?.lockedBalance?.toString() || 0)
        .div(new BigNumber(10).pow(token.decimals))
        .toNumber()
    : 0;

  const available = Math.max(balance - locked, 0);
  const total = available + locked;

  const formatLine = (value: number): string => `${formatCompact(value)} (${toCurrencyFormat(value * price, { maximumFractionDigits: 2 })})`;

  const tooltip = [
    `Total: ${formatLine(total)}`,
    `Available: ${formatLine(available)}`,
    `Staked (locked): ${formatLine(locked)}`,
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
