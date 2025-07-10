import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCourses, type CourseSearchOutput } from '@/src/hooks/api';

export default function SelectCourseScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: courses, isLoading, error } = useCourses();

  const filteredCourses = courses?.courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.state?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCourse = (course: CourseSearchOutput['courses'][0]) => {
    router.push({
      pathname: '/round/create',
      params: {
        courseId: course.id,
        courseName: course.name,
      },
    });
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Select Course' }} />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Failed to load courses</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Select Course' }} />
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={20} color="#6b7280" />
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.courseCard}
              onPress={() => handleSelectCourse(item)}
            >
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{item.name}</Text>
                <Text style={styles.courseLocation}>
                  {item.city}, {item.state}
                </Text>
                <View style={styles.courseDetails}>
                  <Text style={styles.detailText}>
                    {item.holes?.length || 18} holes
                  </Text>
                  {item.par && (
                    <Text style={styles.detailText}>• Par {item.par}</Text>
                  )}
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="golf-course" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No courses found' : 'No courses available'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  listContent: {
    paddingBottom: 16,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  courseLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#9ca3af',
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
});