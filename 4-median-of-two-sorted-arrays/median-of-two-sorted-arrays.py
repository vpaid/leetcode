class Solution(object):
    def findMedianSortedArrays(self, nums1, nums2):
        # Ensure nums1 is the smaller array
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
            
        m, n = len(nums1), len(nums2)
        low, high = 0, m
        
        while low <= high:
            # Partition indices
            i = (low + high) // 2
            j = (m + n + 1) // 2 - i
            
            # Boundary values for nums1
            maxLeft1 = float('-inf') if i == 0 else nums1[i - 1]
            minRight1 = float('inf') if i == m else nums1[i]
            
            # Boundary values for nums2
            maxLeft2 = float('-inf') if j == 0 else nums2[j - 1]
            minRight2 = float('inf') if j == n else nums2[j]
            
            # Check if partition is correct
            if maxLeft1 <= minRight2 and maxLeft2 <= minRight1:
                # Odd total elements
                if (m + n) % 2 != 0:
                    return float(max(maxLeft1, maxLeft2))
                # Even total elements
                else:
                    return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0
            
            # Too far right in nums1, move left
            elif maxLeft1 > minRight2:
                high = i - 1
            # Too far left in nums1, move right
            else:
                low = i + 1
                
        return 0.0