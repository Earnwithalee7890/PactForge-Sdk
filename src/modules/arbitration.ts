import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  boolCV,
  stringUtf8CV,
  uintCV,
  standardPrincipalCV,
  ContractCallOptions,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { CONTRACTS, PACTFORGE_DEPLOYER } from '../constants';
import { Arbiter, Dispute } from '../types';

export class ArbitrationModule {
  private network: StacksNetwork;

  constructor(network: StacksNetwork) {
    this.network = network;
  }

  // --- Transactions ---

  public registerArbiterOptions(): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.ARBITER_DAO,
      functionName: 'register-arbiter',
      functionArgs: [],
      network: this.network,
    };
  }

  public createDisputeOptions(pactId: bigint, reason: string): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.ARBITER_DAO,
      functionName: 'create-dispute',
      functionArgs: [uintCV(pactId), stringUtf8CV(reason)],
      network: this.network,
    };
  }

  public voteDisputeOptions(disputeId: bigint, voteForClient: boolean): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.ARBITER_DAO,
      functionName: 'vote-dispute',
      functionArgs: [uintCV(disputeId), boolCV(voteForClient)],
      network: this.network,
    };
  }

  // --- Read-Only ---

  public async getDispute(disputeId: bigint, senderAddress: string): Promise<Dispute | null> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.ARBITER_DAO,
      functionName: 'get-dispute',
      functionArgs: [uintCV(disputeId)],
      network: this.network,
      senderAddress,
    });

    const json = cvToJSON(result);
    if (!json.value) return null;

    const data = json.value.value;
    return {
      pactId: BigInt(data['pact-id'].value),
      raisedBy: data['raised-by'].value,
      reason: data.reason.value,
      state: parseInt(data.state.value),
      votesClient: BigInt(data['votes-client'].value),
      votesProvider: BigInt(data['votes-provider'].value),
      totalVotes: BigInt(data['total-votes'].value),
      createdAt: BigInt(data['created-at'].value),
      resolvedAt: BigInt(data['resolved-at'].value),
    };
  }

  public async getArbiter(who: string, senderAddress: string): Promise<Arbiter | null> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.ARBITER_DAO,
      functionName: 'get-arbiter',
      functionArgs: [standardPrincipalCV(who)],
      network: this.network,
      senderAddress,
    });

    const json = cvToJSON(result);
    if (!json.value) return null;

    const data = json.value.value;
    return {
      stake: BigInt(data.stake.value),
      disputesResolved: BigInt(data['disputes-resolved'].value),
      registeredAt: BigInt(data['registered-at'].value),
      active: data.active.value === true || data.active.value === 'true',
    };
  }
}
