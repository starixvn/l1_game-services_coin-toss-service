import ProcessBetQueue from '../../src/crons/process-bet-queue';
import GameData from '../../src/game-data';
import { BET_CHOICES } from '../../src/constants';

// Arrange: Mock dependencies and setup
const mockDefinition: any = { choices: [BET_CHOICES.head, BET_CHOICES.tail] };
const mockGameData: { playerBetCount: Record<string, string[]> } = { playerBetCount: { [BET_CHOICES.head]: [], [BET_CHOICES.tail]: [] } };
const mockPlayer = { UID: 'player1' };
const mockBet = { amount: 100, betChoice: BET_CHOICES.head, roundId: 1, clientSeed: new Date() };

describe('ProcessBetQueue', () => {
    let processBetQueue: ProcessBetQueue;

    beforeEach(() => {
        processBetQueue = Object.create(ProcessBetQueue.prototype) as ProcessBetQueue;
        // @ts-ignore
        processBetQueue.definition = mockDefinition;
        // @ts-ignore
        processBetQueue.gameData = mockGameData as unknown as GameData;
    });

    describe('adjustTotalBets_happyPath_shouldCallSuperAndAdjustPlayerBetCount', () => {
        it('should call super.adjustTotalBets and adjustPlayerBetCount', () => {
            // Arrange
            jest.spyOn(Object.getPrototypeOf(ProcessBetQueue.prototype), 'adjustTotalBets').mockImplementation(() => { });
            const adjustPlayerBetCountSpy = jest.spyOn(ProcessBetQueue.prototype, 'adjustPlayerBetCount');
            // Act
            processBetQueue.adjustTotalBets(mockPlayer, mockBet, 2);
            // Assert
            expect(adjustPlayerBetCountSpy).toHaveBeenCalledWith(mockPlayer, mockBet.betChoice);
        });
    });

    describe('adjustPlayerBetCount_withValidChoice_shouldAddPlayerUID', () => {
        it('should add player UID to the correct betChoice array', () => {
            // Act
            processBetQueue.adjustPlayerBetCount(mockPlayer, BET_CHOICES.head);
            // Assert
            expect(mockGameData.playerBetCount[BET_CHOICES.head]).toContain('player1');
        });
    });

    describe('adjustPlayerBetCount_withDuplicateUID_shouldNotAddAgain', () => {
        it('should not add the same UID twice', () => {
            // Arrange
            mockGameData.playerBetCount[BET_CHOICES.head] = ['player1'];
            // Act
            processBetQueue.adjustPlayerBetCount(mockPlayer, BET_CHOICES.head);
            // Assert
            expect(mockGameData.playerBetCount[BET_CHOICES.head].filter((uid: string) => uid === 'player1').length).toBe(1);
        });
    });

    describe('adjustPlayerBetCount_withInvalidChoice_shouldNotAddUID', () => {
        it('should not add UID if betChoice is not in definition.choices', () => {
            // Act
            processBetQueue.adjustPlayerBetCount(mockPlayer, 'invalid' as string);
            // Assert
            expect((mockGameData.playerBetCount as any).invalid).toBeUndefined();
        });
    });

    // Edge: betChoice array not initialized
    describe('adjustPlayerBetCount_withUninitializedArray_shouldInitializeAndAdd', () => {
        it('should initialize array if not present and add UID', () => {
            // Arrange
            delete mockGameData.playerBetCount[BET_CHOICES.tail];
            // Act
            processBetQueue.adjustPlayerBetCount(mockPlayer, BET_CHOICES.tail);
            // Assert
            expect(mockGameData.playerBetCount[BET_CHOICES.tail]).toContain('player1');
        });
    });

    // Error Handling: player UID missing
    describe('adjustPlayerBetCount_withMissingUID_shouldNotThrow', () => {
        it('should not throw if player UID is missing', () => {
            // Arrange
            const badPlayer = {};
            // Act & Assert
            expect(() => processBetQueue.adjustPlayerBetCount(badPlayer, BET_CHOICES.head)).not.toThrow();
        });
    });
}); 