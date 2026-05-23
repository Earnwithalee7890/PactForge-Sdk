import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  ContractCallOptions,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { CONTRACTS, PACTFORGE_DEPLOYER } from '../constants';
import { Reputation } from '../types';

export class ReputationModule {
  private network: StacksNetwork;

  constructor(network: StacksNetwork) {
    this.network = network;
  }

  // --- Transactions ---

  public initReputationOptions(): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.REPUTATION,
      functionName: 'init-reputation',
      functionArgs: [],
      network: this.network,
    };
  }

  // --- Read-Only ---

  public async getReputation(user: string, senderAddress: string): Promise<Reputation | null> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.REPUTATION,
      functionName: 'get-reputation',
      functionArgs: [standardPrincipalCV(user)],
      network: this.network,
      senderAddress,
    });

    const json = cvToJSON(result);
    if (!json.value) return null;

    const data = json.value.value;
    return {
      score: BigInt(data.score.value),
      pactsCompleted: BigInt(data['pacts-completed'].value),
      milestonesDelivered: BigInt(data['milestones-delivered'].value),
      disputesWon: BigInt(data['disputes-won'].value),
      disputesLost: BigInt(data['disputes-lost'].value),
      joinedAt: BigInt(data['joined-at'].value),
    };
  }

  public async getReputationTier(user: string, senderAddress: string): Promise<number> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.REPUTATION,
      functionName: 'get-reputation-tier',
      functionArgs: [standardPrincipalCV(user)],
      network: this.network,
      senderAddress,
    });

    const json = cvToJSON(result);
    if (json.value === undefined) return 0;
    return parseInt(json.value.value);
  }
}
