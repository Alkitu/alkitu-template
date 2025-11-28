// @ts-nocheck
// 
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Injectable, Logger } from '@nestjs/common';
import { IEmailChannel } from './email-channel.interface';
import { EmailResult, EmailVerificationData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Email Verification Channel
 *
 * Handles email verification functionality following OCP.
 * This class is CLOSED for modification but OPEN for extension.
 */
@Injectable()
export class EmailVerificationChannel implements IEmailChannel {
  private readonly logger = new Logger(EmailVerificationChannel.name);
  readonly type = stryMutAct_9fa48("1083") ? "" : (stryCov_9fa48("1083"), 'verification');
  constructor(private readonly emailService: EmailService) {}

  /**
   * Send an email verification email
   */
  async send(data: EmailVerificationData): Promise<EmailResult> {
    if (stryMutAct_9fa48("1084")) {
      {}
    } else {
      stryCov_9fa48("1084");
      try {
        if (stryMutAct_9fa48("1085")) {
          {}
        } else {
          stryCov_9fa48("1085");
          this.logger.log(stryMutAct_9fa48("1086") ? `` : (stryCov_9fa48("1086"), `Sending email verification to ${data.userEmail}`));
          const result = await this.emailService.sendEmailVerification(data);
          this.logger.log(stryMutAct_9fa48("1087") ? `` : (stryCov_9fa48("1087"), `Email verification ${result.success ? stryMutAct_9fa48("1088") ? "" : (stryCov_9fa48("1088"), 'sent successfully') : stryMutAct_9fa48("1089") ? "" : (stryCov_9fa48("1089"), 'failed')} to ${data.userEmail}`));
          return result;
        }
      } catch (error) {
        if (stryMutAct_9fa48("1090")) {
          {}
        } else {
          stryCov_9fa48("1090");
          this.logger.error(stryMutAct_9fa48("1091") ? `` : (stryCov_9fa48("1091"), `Failed to send email verification to ${data.userEmail}:`), error);
          return stryMutAct_9fa48("1092") ? {} : (stryCov_9fa48("1092"), {
            success: stryMutAct_9fa48("1093") ? true : (stryCov_9fa48("1093"), false),
            error: error instanceof Error ? error.message : stryMutAct_9fa48("1094") ? "" : (stryCov_9fa48("1094"), 'Unknown error')
          });
        }
      }
    }
  }

  /**
   * Check if this channel supports the given type
   */
  supports(type: string): boolean {
    if (stryMutAct_9fa48("1095")) {
      {}
    } else {
      stryCov_9fa48("1095");
      return stryMutAct_9fa48("1098") ? type !== 'verification' : stryMutAct_9fa48("1097") ? false : stryMutAct_9fa48("1096") ? true : (stryCov_9fa48("1096", "1097", "1098"), type === (stryMutAct_9fa48("1099") ? "" : (stryCov_9fa48("1099"), 'verification')));
    }
  }

  /**
   * Type guard to check if data is EmailVerificationData
   */
  private isEmailVerificationData(data: unknown): data is EmailVerificationData {
    if (stryMutAct_9fa48("1100")) {
      {}
    } else {
      stryCov_9fa48("1100");
      if (stryMutAct_9fa48("1103") ? !data && typeof data !== 'object' : stryMutAct_9fa48("1102") ? false : stryMutAct_9fa48("1101") ? true : (stryCov_9fa48("1101", "1102", "1103"), (stryMutAct_9fa48("1104") ? data : (stryCov_9fa48("1104"), !data)) || (stryMutAct_9fa48("1106") ? typeof data === 'object' : stryMutAct_9fa48("1105") ? false : (stryCov_9fa48("1105", "1106"), typeof data !== (stryMutAct_9fa48("1107") ? "" : (stryCov_9fa48("1107"), 'object')))))) {
        if (stryMutAct_9fa48("1108")) {
          {}
        } else {
          stryCov_9fa48("1108");
          return stryMutAct_9fa48("1109") ? true : (stryCov_9fa48("1109"), false);
        }
      }
      const emailData = data as Record<string, unknown>;
      return stryMutAct_9fa48("1112") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.verificationUrl === 'string' || typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("1111") ? false : stryMutAct_9fa48("1110") ? true : (stryCov_9fa48("1110", "1111", "1112"), (stryMutAct_9fa48("1114") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' || typeof emailData.verificationUrl === 'string' : stryMutAct_9fa48("1113") ? true : (stryCov_9fa48("1113", "1114"), (stryMutAct_9fa48("1116") ? typeof emailData.userName === 'string' || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("1115") ? true : (stryCov_9fa48("1115", "1116"), (stryMutAct_9fa48("1118") ? typeof emailData.userName !== 'string' : stryMutAct_9fa48("1117") ? true : (stryCov_9fa48("1117", "1118"), typeof emailData.userName === (stryMutAct_9fa48("1119") ? "" : (stryCov_9fa48("1119"), 'string')))) && (stryMutAct_9fa48("1121") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("1120") ? true : (stryCov_9fa48("1120", "1121"), typeof emailData.userEmail === (stryMutAct_9fa48("1122") ? "" : (stryCov_9fa48("1122"), 'string')))))) && (stryMutAct_9fa48("1124") ? typeof emailData.verificationUrl !== 'string' : stryMutAct_9fa48("1123") ? true : (stryCov_9fa48("1123", "1124"), typeof emailData.verificationUrl === (stryMutAct_9fa48("1125") ? "" : (stryCov_9fa48("1125"), 'string')))))) && (stryMutAct_9fa48("1127") ? typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("1126") ? true : (stryCov_9fa48("1126", "1127"), typeof emailData.supportUrl === (stryMutAct_9fa48("1128") ? "" : (stryCov_9fa48("1128"), 'string')))));
    }
  }

  /**
   * Validate email verification data
   */
  validateData(data: unknown): {
    isValid: boolean;
    errors: string[];
  } {
    if (stryMutAct_9fa48("1129")) {
      {}
    } else {
      stryCov_9fa48("1129");
      const errors: string[] = stryMutAct_9fa48("1130") ? ["Stryker was here"] : (stryCov_9fa48("1130"), []);
      if (stryMutAct_9fa48("1133") ? false : stryMutAct_9fa48("1132") ? true : stryMutAct_9fa48("1131") ? data : (stryCov_9fa48("1131", "1132", "1133"), !data)) {
        if (stryMutAct_9fa48("1134")) {
          {}
        } else {
          stryCov_9fa48("1134");
          errors.push(stryMutAct_9fa48("1135") ? "" : (stryCov_9fa48("1135"), 'Email data is required'));
          return stryMutAct_9fa48("1136") ? {} : (stryCov_9fa48("1136"), {
            isValid: stryMutAct_9fa48("1137") ? true : (stryCov_9fa48("1137"), false),
            errors
          });
        }
      }
      if (stryMutAct_9fa48("1140") ? false : stryMutAct_9fa48("1139") ? true : stryMutAct_9fa48("1138") ? this.isEmailVerificationData(data) : (stryCov_9fa48("1138", "1139", "1140"), !this.isEmailVerificationData(data))) {
        if (stryMutAct_9fa48("1141")) {
          {}
        } else {
          stryCov_9fa48("1141");
          errors.push(stryMutAct_9fa48("1142") ? "" : (stryCov_9fa48("1142"), 'Invalid email verification data structure'));
          if (stryMutAct_9fa48("1145") ? typeof data !== 'object' : stryMutAct_9fa48("1144") ? false : stryMutAct_9fa48("1143") ? true : (stryCov_9fa48("1143", "1144", "1145"), typeof data === (stryMutAct_9fa48("1146") ? "" : (stryCov_9fa48("1146"), 'object')))) {
            if (stryMutAct_9fa48("1147")) {
              {}
            } else {
              stryCov_9fa48("1147");
              const emailData = data as Record<string, unknown>;
              if (stryMutAct_9fa48("1150") ? !emailData.userName && typeof emailData.userName !== 'string' : stryMutAct_9fa48("1149") ? false : stryMutAct_9fa48("1148") ? true : (stryCov_9fa48("1148", "1149", "1150"), (stryMutAct_9fa48("1151") ? emailData.userName : (stryCov_9fa48("1151"), !emailData.userName)) || (stryMutAct_9fa48("1153") ? typeof emailData.userName === 'string' : stryMutAct_9fa48("1152") ? false : (stryCov_9fa48("1152", "1153"), typeof emailData.userName !== (stryMutAct_9fa48("1154") ? "" : (stryCov_9fa48("1154"), 'string')))))) {
                if (stryMutAct_9fa48("1155")) {
                  {}
                } else {
                  stryCov_9fa48("1155");
                  errors.push(stryMutAct_9fa48("1156") ? "" : (stryCov_9fa48("1156"), 'userName is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("1159") ? !emailData.userEmail && typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("1158") ? false : stryMutAct_9fa48("1157") ? true : (stryCov_9fa48("1157", "1158", "1159"), (stryMutAct_9fa48("1160") ? emailData.userEmail : (stryCov_9fa48("1160"), !emailData.userEmail)) || (stryMutAct_9fa48("1162") ? typeof emailData.userEmail === 'string' : stryMutAct_9fa48("1161") ? false : (stryCov_9fa48("1161", "1162"), typeof emailData.userEmail !== (stryMutAct_9fa48("1163") ? "" : (stryCov_9fa48("1163"), 'string')))))) {
                if (stryMutAct_9fa48("1164")) {
                  {}
                } else {
                  stryCov_9fa48("1164");
                  errors.push(stryMutAct_9fa48("1165") ? "" : (stryCov_9fa48("1165"), 'userEmail is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("1168") ? !emailData.verificationUrl && typeof emailData.verificationUrl !== 'string' : stryMutAct_9fa48("1167") ? false : stryMutAct_9fa48("1166") ? true : (stryCov_9fa48("1166", "1167", "1168"), (stryMutAct_9fa48("1169") ? emailData.verificationUrl : (stryCov_9fa48("1169"), !emailData.verificationUrl)) || (stryMutAct_9fa48("1171") ? typeof emailData.verificationUrl === 'string' : stryMutAct_9fa48("1170") ? false : (stryCov_9fa48("1170", "1171"), typeof emailData.verificationUrl !== (stryMutAct_9fa48("1172") ? "" : (stryCov_9fa48("1172"), 'string')))))) {
                if (stryMutAct_9fa48("1173")) {
                  {}
                } else {
                  stryCov_9fa48("1173");
                  errors.push(stryMutAct_9fa48("1174") ? "" : (stryCov_9fa48("1174"), 'verificationUrl is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("1177") ? !emailData.supportUrl && typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("1176") ? false : stryMutAct_9fa48("1175") ? true : (stryCov_9fa48("1175", "1176", "1177"), (stryMutAct_9fa48("1178") ? emailData.supportUrl : (stryCov_9fa48("1178"), !emailData.supportUrl)) || (stryMutAct_9fa48("1180") ? typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("1179") ? false : (stryCov_9fa48("1179", "1180"), typeof emailData.supportUrl !== (stryMutAct_9fa48("1181") ? "" : (stryCov_9fa48("1181"), 'string')))))) {
                if (stryMutAct_9fa48("1182")) {
                  {}
                } else {
                  stryCov_9fa48("1182");
                  errors.push(stryMutAct_9fa48("1183") ? "" : (stryCov_9fa48("1183"), 'supportUrl is required and must be a string'));
                }
              }

              // Email format validation
              if (stryMutAct_9fa48("1186") ? emailData.userEmail && typeof emailData.userEmail === 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : stryMutAct_9fa48("1185") ? false : stryMutAct_9fa48("1184") ? true : (stryCov_9fa48("1184", "1185", "1186"), (stryMutAct_9fa48("1188") ? emailData.userEmail || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("1187") ? true : (stryCov_9fa48("1187", "1188"), emailData.userEmail && (stryMutAct_9fa48("1190") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("1189") ? true : (stryCov_9fa48("1189", "1190"), typeof emailData.userEmail === (stryMutAct_9fa48("1191") ? "" : (stryCov_9fa48("1191"), 'string')))))) && (stryMutAct_9fa48("1192") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : (stryCov_9fa48("1192"), !(stryMutAct_9fa48("1203") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("1202") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("1201") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("1200") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("1199") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1198") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("1197") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1196") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1195") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1194") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("1193") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("1193", "1194", "1195", "1196", "1197", "1198", "1199", "1200", "1201", "1202", "1203"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(emailData.userEmail))))) {
                if (stryMutAct_9fa48("1204")) {
                  {}
                } else {
                  stryCov_9fa48("1204");
                  errors.push(stryMutAct_9fa48("1205") ? "" : (stryCov_9fa48("1205"), 'userEmail must be a valid email address'));
                }
              }

              // URL validation (basic)
              if (stryMutAct_9fa48("1208") ? emailData.verificationUrl && typeof emailData.verificationUrl === 'string' || !this.isValidUrl(emailData.verificationUrl) : stryMutAct_9fa48("1207") ? false : stryMutAct_9fa48("1206") ? true : (stryCov_9fa48("1206", "1207", "1208"), (stryMutAct_9fa48("1210") ? emailData.verificationUrl || typeof emailData.verificationUrl === 'string' : stryMutAct_9fa48("1209") ? true : (stryCov_9fa48("1209", "1210"), emailData.verificationUrl && (stryMutAct_9fa48("1212") ? typeof emailData.verificationUrl !== 'string' : stryMutAct_9fa48("1211") ? true : (stryCov_9fa48("1211", "1212"), typeof emailData.verificationUrl === (stryMutAct_9fa48("1213") ? "" : (stryCov_9fa48("1213"), 'string')))))) && (stryMutAct_9fa48("1214") ? this.isValidUrl(emailData.verificationUrl) : (stryCov_9fa48("1214"), !this.isValidUrl(emailData.verificationUrl))))) {
                if (stryMutAct_9fa48("1215")) {
                  {}
                } else {
                  stryCov_9fa48("1215");
                  errors.push(stryMutAct_9fa48("1216") ? "" : (stryCov_9fa48("1216"), 'verificationUrl must be a valid URL'));
                }
              }
              if (stryMutAct_9fa48("1219") ? emailData.supportUrl && typeof emailData.supportUrl === 'string' || !this.isValidUrl(emailData.supportUrl) : stryMutAct_9fa48("1218") ? false : stryMutAct_9fa48("1217") ? true : (stryCov_9fa48("1217", "1218", "1219"), (stryMutAct_9fa48("1221") ? emailData.supportUrl || typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("1220") ? true : (stryCov_9fa48("1220", "1221"), emailData.supportUrl && (stryMutAct_9fa48("1223") ? typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("1222") ? true : (stryCov_9fa48("1222", "1223"), typeof emailData.supportUrl === (stryMutAct_9fa48("1224") ? "" : (stryCov_9fa48("1224"), 'string')))))) && (stryMutAct_9fa48("1225") ? this.isValidUrl(emailData.supportUrl) : (stryCov_9fa48("1225"), !this.isValidUrl(emailData.supportUrl))))) {
                if (stryMutAct_9fa48("1226")) {
                  {}
                } else {
                  stryCov_9fa48("1226");
                  errors.push(stryMutAct_9fa48("1227") ? "" : (stryCov_9fa48("1227"), 'supportUrl must be a valid URL'));
                }
              }
            }
          }
          return stryMutAct_9fa48("1228") ? {} : (stryCov_9fa48("1228"), {
            isValid: stryMutAct_9fa48("1229") ? true : (stryCov_9fa48("1229"), false),
            errors
          });
        }
      }

      // Additional validation for valid data
      if (stryMutAct_9fa48("1232") ? false : stryMutAct_9fa48("1231") ? true : stryMutAct_9fa48("1230") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail) : (stryCov_9fa48("1230", "1231", "1232"), !(stryMutAct_9fa48("1243") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("1242") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("1241") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("1240") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("1239") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1238") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("1237") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1236") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1235") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1234") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("1233") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("1233", "1234", "1235", "1236", "1237", "1238", "1239", "1240", "1241", "1242", "1243"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(data.userEmail))) {
        if (stryMutAct_9fa48("1244")) {
          {}
        } else {
          stryCov_9fa48("1244");
          errors.push(stryMutAct_9fa48("1245") ? "" : (stryCov_9fa48("1245"), 'userEmail must be a valid email address'));
        }
      }
      if (stryMutAct_9fa48("1248") ? false : stryMutAct_9fa48("1247") ? true : stryMutAct_9fa48("1246") ? this.isValidUrl(data.verificationUrl) : (stryCov_9fa48("1246", "1247", "1248"), !this.isValidUrl(data.verificationUrl))) {
        if (stryMutAct_9fa48("1249")) {
          {}
        } else {
          stryCov_9fa48("1249");
          errors.push(stryMutAct_9fa48("1250") ? "" : (stryCov_9fa48("1250"), 'verificationUrl must be a valid URL'));
        }
      }
      if (stryMutAct_9fa48("1253") ? false : stryMutAct_9fa48("1252") ? true : stryMutAct_9fa48("1251") ? this.isValidUrl(data.supportUrl) : (stryCov_9fa48("1251", "1252", "1253"), !this.isValidUrl(data.supportUrl))) {
        if (stryMutAct_9fa48("1254")) {
          {}
        } else {
          stryCov_9fa48("1254");
          errors.push(stryMutAct_9fa48("1255") ? "" : (stryCov_9fa48("1255"), 'supportUrl must be a valid URL'));
        }
      }
      return stryMutAct_9fa48("1256") ? {} : (stryCov_9fa48("1256"), {
        isValid: stryMutAct_9fa48("1259") ? errors.length !== 0 : stryMutAct_9fa48("1258") ? false : stryMutAct_9fa48("1257") ? true : (stryCov_9fa48("1257", "1258", "1259"), errors.length === 0),
        errors
      });
    }
  }
  private isValidUrl(url: string): boolean {
    if (stryMutAct_9fa48("1260")) {
      {}
    } else {
      stryCov_9fa48("1260");
      try {
        if (stryMutAct_9fa48("1261")) {
          {}
        } else {
          stryCov_9fa48("1261");
          new URL(url);
          return stryMutAct_9fa48("1262") ? false : (stryCov_9fa48("1262"), true);
        }
      } catch {
        if (stryMutAct_9fa48("1263")) {
          {}
        } else {
          stryCov_9fa48("1263");
          return stryMutAct_9fa48("1264") ? true : (stryCov_9fa48("1264"), false);
        }
      }
    }
  }
}