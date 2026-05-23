import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  makeContractCall,
  standardPrincipalCV,
  uintCV,
  stringUtf8CV,
  ContractCallOptions,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { CONTRACTS, PACTFORGE_DEPLOYER } from '../constants';
import { Pact, ProtocolStats } from '../types';

export class PactsModule {
  private network: StacksNetwork;

  constructor(network: StacksNetwork) {
    this.network = network;
  }

  // --- Transactions ---

  public createPactOptions(
    provider: string,
    totalAmount: bigint,
    title: string,
    description: string,
    deadline: bigint,
    milestoneCount: bigint
  ): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.CORE,
      functionName: 'create-pact',
      functionArgs: [
        standardPrincipalCV(provider),
        uintCV(totalAmount),
        stringUtf8CV(title),
        stringUtf8CV(description),
        uintCV(deadline),
        uintCV(milestoneCount),
      ],
      network: this.network,
    };
  }

  public fundPactOptions(pactId: bigint): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.CORE,
      functionName: 'fund-pact',
      functionArgs: [uintCV(pactId)],
      network: this.network,
    };
  }

  public acceptPactOptions(pactId: bigint): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.CORE,
      functionName: 'accept-pact',
      functionArgs: [uintCV(pactId)],
      network: this.network,
    };
  }

  public releasePaymentOptions(pactId: bigint, amount: bigint): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.CORE,
      functionName: 'release-payment',
      functionArgs: [uintCV(pactId), uintCV(amount)],
      network: this.network,
    };
  }

  public cancelPactOptions(pactId: bigint): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.CORE,
      functionName: 'cancel-pact',
      functionArgs: [uintCV(pactId)],
      network: this.network,
    };
  }

  public raiseDisputeOptions(pactId: bigint): ContractCallOptions {
    return {
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.CORE,
      functionName: 'raise-dispute',
      functionArgs: [uintCV(pactId)],
      network: this.network,
    };
  }

  // --- Read-Only ---

  public async getPact(pactId: bigint, senderAddress: string): Promise<Pact | null> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.CORE,
      functionName: 'get-pact',
      functionArgs: [uintCV(pactId)],
      network: this.network,
      senderAddress,
    });

    const json = cvToJSON(result);
    if (!json.value) return null;

    const data = json.value.value;
    return {
      client: data.client.value,
      provider: data.provider.value,
      totalAmount: BigInt(data['total-amount'].value),
      fundedAmount: BigInt(data['funded-amount'].value),
      releasedAmount: BigInt(data['released-amount'].value),
      state: parseInt(data.state.value),
      title: data.title.value,
      description: data.description.value,
      createdAt: BigInt(data['created-at'].value),
      deadline: BigInt(data.deadline.value),
      milestoneCount: BigInt(data['milestone-count'].value),
    };
  }

  public async getPactCount(senderAddress: string): Promise<bigint> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.CORE,
      functionName: 'get-pact-count',
      functionArgs: [],
      network: this.network,
      senderAddress,
    });
    return BigInt(cvToJSON(result).value);
  }

  public async getProtocolStats(senderAddress: string): Promise<ProtocolStats> {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: PACTFORGE_DEPLOYER,
      contractName: CONTRACTS.CORE,
      functionName: 'get-protocol-stats',
      functionArgs: [],
      network: this.network,
      senderAddress,
    });
    const data = cvToJSON(result).value;
    return {
      totalPacts: BigInt(data['total-pacts'].value),
      completedPacts: BigInt(data['completed-pacts'].value),
      totalVolume: BigInt(data['total-volume'].value),
    };
  }
}
