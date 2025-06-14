import React, { useRef, useEffect } from 'react';
import { Components, Token } from '@reef-chain/react-lib';
import Uik from '@reef-chain/ui-kit';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import BigNumber from 'bignumber.js';
import './token-card-tooltip.css';

const { TokenCard } = Components;

interface Props extends React.ComponentProps<typeof TokenCard> {
  token: Token;
}

const formatBalance = (token: Token): string => {
  try {
    return new BigNumber(token.balance.toString())
      .div(new BigNumber(10).pow(token.decimals))
      .toString();
  } catch {
    return '0';
  }
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
  const tooltip = `Total balance: ${balance}\nAvailable balance: ${balance}\nStaked (locked) balance: 0`;

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
