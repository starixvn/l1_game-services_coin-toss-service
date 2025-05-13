import { roundUserBetPercentage, calculateUserBetPercentage } from '../../../src/helpers/bet-percentage';

describe('roundUserBetPercentage', () => {
    it('should set both head and tail to 0 if both are missing', () => {
        // Arrange
        const input = {};
        // Act
        const result = roundUserBetPercentage(input);
        // Assert
        expect(result).toEqual({ head: 0, tail: 0 });
    });

    it('should round head and tail to integers', () => {
        // Arrange
        const input = { head: 66.6, tail: 33.3 };
        // Act
        const result = roundUserBetPercentage({ ...input });
        // Assert
        expect(result).toEqual({ head: 66, tail: 34 });
    });

    it('should set tail to 100 - head if head > 0', () => {
        // Arrange
        const input = { head: 80 };
        // Act
        const result = roundUserBetPercentage({ ...input });
        // Assert
        expect(result).toEqual({ head: 80, tail: 20 });
    });

    it('should set head to 100 - tail if head is 0', () => {
        // Arrange
        const input = { head: 0, tail: 55 };
        // Act
        const result = roundUserBetPercentage({ ...input });
        // Assert
        expect(result).toEqual({ head: 45, tail: 55 });
    });

    it('should handle negative and over-100 values gracefully', () => {
        // Arrange
        const input = { head: 120, tail: -20 };
        // Act
        const result = roundUserBetPercentage({ ...input });
        // Assert
        expect(result).toEqual({ head: 120, tail: -20 });
    });
});

describe('calculateUserBetPercentage', () => {
    it('should return 0 for both if input is empty', () => {
        // Arrange
        const input = {};
        // Act
        const result = calculateUserBetPercentage(input);
        // Assert
        expect(result).toEqual({});
    });

    it('should calculate correct percentages for head and tail', () => {
        // Arrange
        const input = { head: ['a', 'b'], tail: ['c'] };
        // Act
        const result = calculateUserBetPercentage(input);
        // Assert
        expect(result).toEqual({ head: 66.67, tail: 33.33 });
    });

    it('should handle only head', () => {
        // Arrange
        const input = { head: ['a', 'b', 'c'] };
        // Act
        const result = calculateUserBetPercentage(input);
        // Assert
        expect(result).toEqual({ head: 100 });
    });

    it('should handle only tail', () => {
        // Arrange
        const input = { tail: ['x'] };
        // Act
        const result = calculateUserBetPercentage(input);
        // Assert
        expect(result).toEqual({ tail: 100 });
    });

    it('should handle large numbers', () => {
        // Arrange
        const input = { head: Array(99).fill('a'), tail: Array(1).fill('b') };
        // Act
        const result = calculateUserBetPercentage(input);
        // Assert
        expect(result.head).toBeCloseTo(99, 0);
        expect(result.tail).toBeCloseTo(1, 0);
    });
}); 