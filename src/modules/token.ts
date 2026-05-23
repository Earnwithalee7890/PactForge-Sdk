import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { CONTRACTS, PACTFORGE_DEPLOYER } from '../constants';

export class TokenModule {
  private network: StacksNetwork;

  constructor(network: StacksNetwork) {
    this.network = network;
  }

  public async getBalance(who: string, senderAddress: string): Promise<bigint> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.TOKEN,
      functionName: 'get-balance',
      functionArgs: [standardPrincipalCV(who)],
      network: this.network,
      senderAddress,
    });
    
    // Result is wrapped in (ok uint)
    const json = cvToJSON(result);
    return BigInt(json.value.value);
  }

  public async getTotalSupply(senderAddress: string): Promise<bigint> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.TOKEN,
      functionName: 'get-total-supply',
      functionArgs: [],
      network: this.network,
      senderAddress,
    });
    
    // Result is wrapped in (ok uint)
    const json = cvToJSON(result);
    return BigInt(json.value.value);
  }
}
