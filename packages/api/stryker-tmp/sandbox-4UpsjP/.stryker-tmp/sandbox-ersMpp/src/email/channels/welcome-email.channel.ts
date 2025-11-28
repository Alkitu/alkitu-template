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
import { EmailResult, WelcomeEmailData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Welcome Email Channel
 *
 * Handles welcome email functionality following OCP.
 * This class is CLOSED for modification but OPEN for extension.
 */
@Injectable()
export class WelcomeEmailChannel implements IEmailChannel {
  private readonly logger = new Logger(WelcomeEmailChannel.name);
  readonly type = stryMutAct_9fa48("1265") ? "" : (stryCov_9fa48("1265"), 'welcome');
  constructor(private readonly emailService: EmailService) {}

  /**
   * Send a welcome email
   */
  async send(data: WelcomeEmailData): Promise<EmailResult> {
    if (stryMutAct_9fa48("1266")) {
      {}
    } else {
      stryCov_9fa48("1266");
      try {
        if (stryMutAct_9fa48("1267")) {
          {}
        } else {
          stryCov_9fa48("1267");
          this.logger.log(stryMutAct_9fa48("1268") ? `` : (stryCov_9fa48("1268"), `Sending welcome email to ${data.userEmail}`));
          const result = await this.emailService.sendWelcomeEmail(data);
          this.logger.log(stryMutAct_9fa48("1269") ? `` : (stryCov_9fa48("1269"), `Welcome email ${result.success ? stryMutAct_9fa48("1270") ? "" : (stryCov_9fa48("1270"), 'sent successfully') : stryMutAct_9fa48("1271") ? "" : (stryCov_9fa48("1271"), 'failed')} to ${data.userEmail}`));
          return result;
        }
      } catch (error) {
        if (stryMutAct_9fa48("1272")) {
          {}
        } else {
          stryCov_9fa48("1272");
          this.logger.error(stryMutAct_9fa48("1273") ? `` : (stryCov_9fa48("1273"), `Failed to send welcome email to ${data.userEmail}:`), error);
          return stryMutAct_9fa48("1274") ? {} : (stryCov_9fa48("1274"), {
            success: stryMutAct_9fa48("1275") ? true : (stryCov_9fa48("1275"), false),
            error: error instanceof Error ? error.message : stryMutAct_9fa48("1276") ? "" : (stryCov_9fa48("1276"), 'Unknown error')
          });
        }
      }
    }
  }

  /**
   * Check if this channel supports the given type
   */
  supports(type: string): boolean {
    if (stryMutAct_9fa48("1277")) {
      {}
    } else {
      stryCov_9fa48("1277");
      return stryMutAct_9fa48("1280") ? type !== 'welcome' : stryMutAct_9fa48("1279") ? false : stryMutAct_9fa48("1278") ? true : (stryCov_9fa48("1278", "1279", "1280"), type === (stryMutAct_9fa48("1281") ? "" : (stryCov_9fa48("1281"), 'welcome')));
    }
  }

  /**
   * Type guard to check if data is WelcomeEmailData
   */
  private isWelcomeEmailData(data: unknown): data is WelcomeEmailData {
    if (stryMutAct_9fa48("1282")) {
      {}
    } else {
      stryCov_9fa48("1282");
      if (stryMutAct_9fa48("1285") ? !data && typeof data !== 'object' : stryMutAct_9fa48("1284") ? false : stryMutAct_9fa48("1283") ? true : (stryCov_9fa48("1283", "1284", "1285"), (stryMutAct_9fa48("1286") ? data : (stryCov_9fa48("1286"), !data)) || (stryMutAct_9fa48("1288") ? typeof data === 'object' : stryMutAct_9fa48("1287") ? false : (stryCov_9fa48("1287", "1288"), typeof data !== (stryMutAct_9fa48("1289") ? "" : (stryCov_9fa48("1289"), 'object')))))) {
        if (stryMutAct_9fa48("1290")) {
          {}
        } else {
          stryCov_9fa48("1290");
          return stryMutAct_9fa48("1291") ? true : (stryCov_9fa48("1291"), false);
        }
      }
      const emailData = data as Record<string, unknown>;
      return stryMutAct_9fa48("1294") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.registrationDate === 'string' && typeof emailData.loginUrl === 'string' && typeof emailData.unsubscribeUrl === 'string' || typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("1293") ? false : stryMutAct_9fa48("1292") ? true : (stryCov_9fa48("1292", "1293", "1294"), (stryMutAct_9fa48("1296") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.registrationDate === 'string' && typeof emailData.loginUrl === 'string' || typeof emailData.unsubscribeUrl === 'string' : stryMutAct_9fa48("1295") ? true : (stryCov_9fa48("1295", "1296"), (stryMutAct_9fa48("1298") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.registrationDate === 'string' || typeof emailData.loginUrl === 'string' : stryMutAct_9fa48("1297") ? true : (stryCov_9fa48("1297", "1298"), (stryMutAct_9fa48("1300") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' || typeof emailData.registrationDate === 'string' : stryMutAct_9fa48("1299") ? true : (stryCov_9fa48("1299", "1300"), (stryMutAct_9fa48("1302") ? typeof emailData.userName === 'string' || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("1301") ? true : (stryCov_9fa48("1301", "1302"), (stryMutAct_9fa48("1304") ? typeof emailData.userName !== 'string' : stryMutAct_9fa48("1303") ? true : (stryCov_9fa48("1303", "1304"), typeof emailData.userName === (stryMutAct_9fa48("1305") ? "" : (stryCov_9fa48("1305"), 'string')))) && (stryMutAct_9fa48("1307") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("1306") ? true : (stryCov_9fa48("1306", "1307"), typeof emailData.userEmail === (stryMutAct_9fa48("1308") ? "" : (stryCov_9fa48("1308"), 'string')))))) && (stryMutAct_9fa48("1310") ? typeof emailData.registrationDate !== 'string' : stryMutAct_9fa48("1309") ? true : (stryCov_9fa48("1309", "1310"), typeof emailData.registrationDate === (stryMutAct_9fa48("1311") ? "" : (stryCov_9fa48("1311"), 'string')))))) && (stryMutAct_9fa48("1313") ? typeof emailData.loginUrl !== 'string' : stryMutAct_9fa48("1312") ? true : (stryCov_9fa48("1312", "1313"), typeof emailData.loginUrl === (stryMutAct_9fa48("1314") ? "" : (stryCov_9fa48("1314"), 'string')))))) && (stryMutAct_9fa48("1316") ? typeof emailData.unsubscribeUrl !== 'string' : stryMutAct_9fa48("1315") ? true : (stryCov_9fa48("1315", "1316"), typeof emailData.unsubscribeUrl === (stryMutAct_9fa48("1317") ? "" : (stryCov_9fa48("1317"), 'string')))))) && (stryMutAct_9fa48("1319") ? typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("1318") ? true : (stryCov_9fa48("1318", "1319"), typeof emailData.supportUrl === (stryMutAct_9fa48("1320") ? "" : (stryCov_9fa48("1320"), 'string')))));
    }
  }

  /**
   * Validate welcome email data
   */
  validateData(data: unknown): {
    isValid: boolean;
    errors: string[];
  } {
    if (stryMutAct_9fa48("1321")) {
      {}
    } else {
      stryCov_9fa48("1321");
      const errors: string[] = stryMutAct_9fa48("1322") ? ["Stryker was here"] : (stryCov_9fa48("1322"), []);
      if (stryMutAct_9fa48("1325") ? false : stryMutAct_9fa48("1324") ? true : stryMutAct_9fa48("1323") ? data : (stryCov_9fa48("1323", "1324", "1325"), !data)) {
        if (stryMutAct_9fa48("1326")) {
          {}
        } else {
          stryCov_9fa48("1326");
          errors.push(stryMutAct_9fa48("1327") ? "" : (stryCov_9fa48("1327"), 'Email data is required'));
          return stryMutAct_9fa48("1328") ? {} : (stryCov_9fa48("1328"), {
            isValid: stryMutAct_9fa48("1329") ? true : (stryCov_9fa48("1329"), false),
            errors
          });
        }
      }
      if (stryMutAct_9fa48("1332") ? false : stryMutAct_9fa48("1331") ? true : stryMutAct_9fa48("1330") ? this.isWelcomeEmailData(data) : (stryCov_9fa48("1330", "1331", "1332"), !this.isWelcomeEmailData(data))) {
        if (stryMutAct_9fa48("1333")) {
          {}
        } else {
          stryCov_9fa48("1333");
          errors.push(stryMutAct_9fa48("1334") ? "" : (stryCov_9fa48("1334"), 'Invalid welcome email data structure'));
          if (stryMutAct_9fa48("1337") ? typeof data !== 'object' : stryMutAct_9fa48("1336") ? false : stryMutAct_9fa48("1335") ? true : (stryCov_9fa48("1335", "1336", "1337"), typeof data === (stryMutAct_9fa48("1338") ? "" : (stryCov_9fa48("1338"), 'object')))) {
            if (stryMutAct_9fa48("1339")) {
              {}
            } else {
              stryCov_9fa48("1339");
              const emailData = data as Record<string, unknown>;
              if (stryMutAct_9fa48("1342") ? !emailData.userName && typeof emailData.userName !== 'string' : stryMutAct_9fa48("1341") ? false : stryMutAct_9fa48("1340") ? true : (stryCov_9fa48("1340", "1341", "1342"), (stryMutAct_9fa48("1343") ? emailData.userName : (stryCov_9fa48("1343"), !emailData.userName)) || (stryMutAct_9fa48("1345") ? typeof emailData.userName === 'string' : stryMutAct_9fa48("1344") ? false : (stryCov_9fa48("1344", "1345"), typeof emailData.userName !== (stryMutAct_9fa48("1346") ? "" : (stryCov_9fa48("1346"), 'string')))))) {
                if (stryMutAct_9fa48("1347")) {
                  {}
                } else {
                  stryCov_9fa48("1347");
                  errors.push(stryMutAct_9fa48("1348") ? "" : (stryCov_9fa48("1348"), 'userName is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("1351") ? !emailData.userEmail && typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("1350") ? false : stryMutAct_9fa48("1349") ? true : (stryCov_9fa48("1349", "1350", "1351"), (stryMutAct_9fa48("1352") ? emailData.userEmail : (stryCov_9fa48("1352"), !emailData.userEmail)) || (stryMutAct_9fa48("1354") ? typeof emailData.userEmail === 'string' : stryMutAct_9fa48("1353") ? false : (stryCov_9fa48("1353", "1354"), typeof emailData.userEmail !== (stryMutAct_9fa48("1355") ? "" : (stryCov_9fa48("1355"), 'string')))))) {
                if (stryMutAct_9fa48("1356")) {
                  {}
                } else {
                  stryCov_9fa48("1356");
                  errors.push(stryMutAct_9fa48("1357") ? "" : (stryCov_9fa48("1357"), 'userEmail is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("1360") ? !emailData.registrationDate && typeof emailData.registrationDate !== 'string' : stryMutAct_9fa48("1359") ? false : stryMutAct_9fa48("1358") ? true : (stryCov_9fa48("1358", "1359", "1360"), (stryMutAct_9fa48("1361") ? emailData.registrationDate : (stryCov_9fa48("1361"), !emailData.registrationDate)) || (stryMutAct_9fa48("1363") ? typeof emailData.registrationDate === 'string' : stryMutAct_9fa48("1362") ? false : (stryCov_9fa48("1362", "1363"), typeof emailData.registrationDate !== (stryMutAct_9fa48("1364") ? "" : (stryCov_9fa48("1364"), 'string')))))) {
                if (stryMutAct_9fa48("1365")) {
                  {}
                } else {
                  stryCov_9fa48("1365");
                  errors.push(stryMutAct_9fa48("1366") ? "" : (stryCov_9fa48("1366"), 'registrationDate is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("1369") ? !emailData.loginUrl && typeof emailData.loginUrl !== 'string' : stryMutAct_9fa48("1368") ? false : stryMutAct_9fa48("1367") ? true : (stryCov_9fa48("1367", "1368", "1369"), (stryMutAct_9fa48("1370") ? emailData.loginUrl : (stryCov_9fa48("1370"), !emailData.loginUrl)) || (stryMutAct_9fa48("1372") ? typeof emailData.loginUrl === 'string' : stryMutAct_9fa48("1371") ? false : (stryCov_9fa48("1371", "1372"), typeof emailData.loginUrl !== (stryMutAct_9fa48("1373") ? "" : (stryCov_9fa48("1373"), 'string')))))) {
                if (stryMutAct_9fa48("1374")) {
                  {}
                } else {
                  stryCov_9fa48("1374");
                  errors.push(stryMutAct_9fa48("1375") ? "" : (stryCov_9fa48("1375"), 'loginUrl is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("1378") ? !emailData.unsubscribeUrl && typeof emailData.unsubscribeUrl !== 'string' : stryMutAct_9fa48("1377") ? false : stryMutAct_9fa48("1376") ? true : (stryCov_9fa48("1376", "1377", "1378"), (stryMutAct_9fa48("1379") ? emailData.unsubscribeUrl : (stryCov_9fa48("1379"), !emailData.unsubscribeUrl)) || (stryMutAct_9fa48("1381") ? typeof emailData.unsubscribeUrl === 'string' : stryMutAct_9fa48("1380") ? false : (stryCov_9fa48("1380", "1381"), typeof emailData.unsubscribeUrl !== (stryMutAct_9fa48("1382") ? "" : (stryCov_9fa48("1382"), 'string')))))) {
                if (stryMutAct_9fa48("1383")) {
                  {}
                } else {
                  stryCov_9fa48("1383");
                  errors.push(stryMutAct_9fa48("1384") ? "" : (stryCov_9fa48("1384"), 'unsubscribeUrl is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("1387") ? !emailData.supportUrl && typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("1386") ? false : stryMutAct_9fa48("1385") ? true : (stryCov_9fa48("1385", "1386", "1387"), (stryMutAct_9fa48("1388") ? emailData.supportUrl : (stryCov_9fa48("1388"), !emailData.supportUrl)) || (stryMutAct_9fa48("1390") ? typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("1389") ? false : (stryCov_9fa48("1389", "1390"), typeof emailData.supportUrl !== (stryMutAct_9fa48("1391") ? "" : (stryCov_9fa48("1391"), 'string')))))) {
                if (stryMutAct_9fa48("1392")) {
                  {}
                } else {
                  stryCov_9fa48("1392");
                  errors.push(stryMutAct_9fa48("1393") ? "" : (stryCov_9fa48("1393"), 'supportUrl is required and must be a string'));
                }
              }

              // Email format validation
              if (stryMutAct_9fa48("1396") ? emailData.userEmail && typeof emailData.userEmail === 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : stryMutAct_9fa48("1395") ? false : stryMutAct_9fa48("1394") ? true : (stryCov_9fa48("1394", "1395", "1396"), (stryMutAct_9fa48("1398") ? emailData.userEmail || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("1397") ? true : (stryCov_9fa48("1397", "1398"), emailData.userEmail && (stryMutAct_9fa48("1400") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("1399") ? true : (stryCov_9fa48("1399", "1400"), typeof emailData.userEmail === (stryMutAct_9fa48("1401") ? "" : (stryCov_9fa48("1401"), 'string')))))) && (stryMutAct_9fa48("1402") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : (stryCov_9fa48("1402"), !(stryMutAct_9fa48("1413") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("1412") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("1411") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("1410") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("1409") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1408") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("1407") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1406") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1405") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1404") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("1403") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("1403", "1404", "1405", "1406", "1407", "1408", "1409", "1410", "1411", "1412", "1413"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(emailData.userEmail))))) {
                if (stryMutAct_9fa48("1414")) {
                  {}
                } else {
                  stryCov_9fa48("1414");
                  errors.push(stryMutAct_9fa48("1415") ? "" : (stryCov_9fa48("1415"), 'userEmail must be a valid email address'));
                }
              }
            }
          }
          return stryMutAct_9fa48("1416") ? {} : (stryCov_9fa48("1416"), {
            isValid: stryMutAct_9fa48("1417") ? true : (stryCov_9fa48("1417"), false),
            errors
          });
        }
      }

      // Email format validation for valid data
      if (stryMutAct_9fa48("1420") ? false : stryMutAct_9fa48("1419") ? true : stryMutAct_9fa48("1418") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail) : (stryCov_9fa48("1418", "1419", "1420"), !(stryMutAct_9fa48("1431") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("1430") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("1429") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("1428") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("1427") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1426") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("1425") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1424") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1423") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1422") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("1421") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("1421", "1422", "1423", "1424", "1425", "1426", "1427", "1428", "1429", "1430", "1431"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(data.userEmail))) {
        if (stryMutAct_9fa48("1432")) {
          {}
        } else {
          stryCov_9fa48("1432");
          errors.push(stryMutAct_9fa48("1433") ? "" : (stryCov_9fa48("1433"), 'userEmail must be a valid email address'));
        }
      }
      return stryMutAct_9fa48("1434") ? {} : (stryCov_9fa48("1434"), {
        isValid: stryMutAct_9fa48("1437") ? errors.length !== 0 : stryMutAct_9fa48("1436") ? false : stryMutAct_9fa48("1435") ? true : (stryCov_9fa48("1435", "1436", "1437"), errors.length === 0),
        errors
      });
    }
  }
}