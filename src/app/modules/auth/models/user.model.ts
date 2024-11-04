import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  userId: number;
  memberId: number;
  username: string;
  Email: string;
  firstName: string;
  lastName: string;
  nameTH: string;
  branchId:number;
  abbrName: string;
  companyName: string;
  // roles: number[] = [];
  // occupation: string;
  // companyName: string;
  // phone: string;
  // address?: AddressModel;
  // socialNetworks?: SocialNetworksModel;
  // // personal information
  // firstname: string;
  // lastname: string;
  // website: string;
  // // account information
  // language: string;
  // timeZone: string;
  // communication: {
  //   email: boolean;
  //   sms: boolean;
  //   phone: boolean;
  // };
  // // email settings
  // emailSettings?: {
  //   emailNotification: boolean;
  //   sendCopyToPersonalEmail: boolean;
  //   activityRelatesEmail: {
  //     youHaveNewNotifications: boolean;
  //     youAreSentADirectMessage: boolean;
  //     someoneAddsYouAsAsAConnection: boolean;
  //     uponNewOrder: boolean;
  //     newMembershipApproval: boolean;
  //     memberRegistration: boolean;
  //   };
  //   updatesFromKeenthemes: {
  //     newsAboutKeenthemesProductsAndFeatureUpdates: boolean;
  //     tipsOnGettingMoreOutOfKeen: boolean;
  //     thingsYouMissedSindeYouLastLoggedIntoKeen: boolean;
  //     newsAboutMetronicOnPartnerProductsAndOtherServices: boolean;
  //     tipsOnMetronicBusinessProducts: boolean;
  //   };
  // };

  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.userId = user.userId;
    this.memberId = user.memberId;
    this.username = user.username || '';
    this.Email = user.Email || '';
    this.firstName = user.firstName || '';
    this.lastName = user.lastName || '';
    this.nameTH = user.nameTH || '';
    this.branchId = user.branchId;
  }
}
